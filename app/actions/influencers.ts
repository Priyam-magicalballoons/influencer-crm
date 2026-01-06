"use server";

import { sql } from "@/db/index";
import { Influencer, InfluencerType } from "@/lib/types";
import { requireAuth } from "./auth";
import { verifyJWT } from "@/lib/jwt";
import { verifySession } from "@/lib/tokens";

export const createInfluencer = async (influencerData: Influencer) => {
  const sessionData = (await verifySession()) as any;
  if (sessionData.status === 400 || sessionData.status === 401) {
    return sessionData;
  }
  try {
    const create = await sql`
    WITH user_data AS (
      SELECT id, name FROM users WHERE id=${sessionData.user.userId}
    ) INSERT INTO influencers (
        name,
        profile,
        brand_name,
        followers,
        type,
        email,
        contact,
        payout,
        product_amount,
        order_date,
        receive_date,
        published_date,
        reel_link,
        mail_status,
        photo,
        review,
        views,
        likes,
        comments,
        payment_date,
        gpay_number,
        payment_status,
        payment_done,
        approval_required,
        approval_status,
        approval_comment,
        creator_id,
        creator_name
        ) SELECT 
          ${influencerData.name},
          ${influencerData.profile},
          ${influencerData.brand_name},
          ${influencerData.followers},
          ${influencerData.type},
          ${influencerData.email},
          ${influencerData.contact},
          ${influencerData.payout},
          ${influencerData.product_amount},
          ${influencerData.order_date || null},
          ${influencerData.receive_date || null},
          ${influencerData.published_date || null},
          ${influencerData.reel_link},
          ${influencerData.mail_status},
          ${influencerData.photo},
          ${influencerData.review},
          ${influencerData.views},
          ${influencerData.likes},
          ${influencerData.comments},
          ${influencerData.payment_date || null},
          ${influencerData.gpay_number},
          ${influencerData.payment_status},
          ${influencerData.payment_done || null},
          ${influencerData.approval_required},
          ${influencerData.approval_status},
          ${influencerData.approval_comment},
          id,
          name
          FROM user_data RETURNING *`;

    return create[0];
  } catch (error) {
    return {
      status: 500,
      data: "Internal server Error",
    };
  }
};
export const updateInfluencer = async (influencerData: Influencer) => {
  const sessionData = await verifySession();
  const influencerId = influencerData.id;
  try {
    const update = await sql`UPDATE influencers SET
        name = ${influencerData.name},
        profile = ${influencerData.profile},
        brand_name = ${influencerData.brand_name},
        followers = ${influencerData.followers},
        type = ${influencerData.type},
        email = ${influencerData.email},
        contact = ${influencerData.contact},
        payout = ${influencerData.payout},
        product_amount = ${influencerData.product_amount},
        order_date = ${influencerData.order_date || null},
        receive_date = ${influencerData.receive_date || null},
        published_date = ${influencerData.published_date || null},
        reel_link = ${influencerData.reel_link},
        mail_status = ${influencerData.mail_status},
        photo = ${influencerData.photo},
        review = ${influencerData.review},
        views = ${influencerData.views},
        likes = ${influencerData.likes},
        comments = ${influencerData.comments},
        payment_date = ${influencerData.payment_date || null},
        gpay_number = ${influencerData.gpay_number},
        payment_status = ${influencerData.payment_status},
        payment_done = ${influencerData.payment_done || null},
        approval_required = ${influencerData.approval_required},
        ask_price = ${influencerData.ask_price},
        approval_status = ${influencerData.approval_status},
        approval_comment = ${influencerData.approval_comment}
         WHERE id=${influencerId}`;
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: "Internal server Error",
    };
  }
};

export const deleteInfluencerData = async (influencerId: string) => {
  const sessionData = await verifySession();
  try {
    if (!influencerId) {
      return {
        status: 500,
      };
    }

    const deleteInfluencer =
      await sql`DELETE FROM influencers WHERE id=${influencerId}`;
  } catch (error) {
    return {
      status: 500,
    };
  }
};

export const getAllInfluencers = async () => {
  const data = await verifySession();

  if (data.status === 400) {
    return data;
  }

  if (data.status === 401) {
    return data;
  }

  const influencers = await sql`SELECT * FROM influencers ORDER BY created_at`;

  return {
    status: 200,
    data: influencers,
  };
};
