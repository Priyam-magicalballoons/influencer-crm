"use server";

import { sql } from "@/db";
import { verifySession } from "@/lib/tokens";

export const createBrand = async (brandName: string) => {
  const sessionData = (await verifySession()) as any;
  if (sessionData.status === 400 || sessionData.status === 401) {
    return sessionData;
  }
  if (sessionData.user.role !== "ADMIN") {
    return {
      status: 403,
      message: "Only Admin can create brands",
    };
  }
  try {
    const create = await sql`
   WITH inserted AS (
    INSERT INTO brand (name)
     VALUES (${brandName}) 
     ON CONFLICT (name) DO NOTHING 
     RETURNING *) 
     SELECT 
     (SELECT json_agg(inserted) FROM inserted) AS INSERTED,
     (SELECT json_agg(brand) FROM brand) AS brands`;

    const row = create[0];
    if (!row.inserted) {
      return {
        status: 500,
        message: "Brand Name Already Exists",
      };
    }
    return {
      status: 201,
      data: [...row.brands, ...row.inserted],
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something Went Wrong",
    };
  }
};

export const getALlBrands = async () => {
  try {
    return await sql`SELECT * FROM brand`;
  } catch (error) {
    return {
      status: 500,
    };
  }
};

export const deleteBrand = async (id: string) => {
  const sessionData = (await verifySession()) as any;
  if (sessionData.status === 400 || sessionData.status === 401) {
    return sessionData;
  }
  if (sessionData.user.role !== "ADMIN") {
    return {
      status: 403,
      message: "Only Admin can delete brands",
    };
  }
  try {
    const deleteBrand = sql`WITH deleted AS (DELETE FROM brand WHERE id=${id} RETURNING *) SELECT * FROM brand`;
    return {
      status: 200,
      data: deleteBrand,
    };
  } catch (error) {
    return {
      status: 500,
    };
  }
};
