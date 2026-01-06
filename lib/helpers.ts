"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { sql } from "@/db";

export const tokenExists = async () => {
  try {
    const token = (await cookies()).get("access");
    if (!token) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getRole = async () => {
  try {
    const token = (await cookies()).get("access")?.value;
    if (!token) {
      return {
        status: 400,
        role: null,
      };
    }
    const role = jwt.decode(token) as any;
    if (!role) {
      return {
        status: 400,
        role: null,
      };
    }

    return {
      status: 200,
      role: role.role,
    };
  } catch (error) {
    return {
      status: 400,
      role: null,
    };
  }
};

// export const getUserData = async () => {
//   try {
//     const token = (await cookies()).get("access")?.value;

//     if (!token) {
//       return {
//         status: 400,
//         user: null,
//       };
//     }

//     const { id, role } = jwt.decode(token) as any;

//     if (!id) {
//       return {
//         status: 400,
//         user: null,
//       };
//     }

//     return {
//       status: 200,
//       user: {
//         userId: id,
//         role,
//       },
//     };
//   } catch (error) {
//     return {
//       status: 400,
//       user: null,
//     };
//   }
// };

export const logoutUser = async () => {
  const refresh = (await cookies()).get("refresh")?.value;
  (await cookies()).delete("access");
  (await cookies()).delete("refresh");

  await sql`DELETE FROM sessions WHERE id=${refresh}`;
  redirect("/login");
};
