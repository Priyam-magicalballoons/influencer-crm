"use server";

import { sql } from "@/db/index";
import { getUserData } from "@/lib/helpers";
import { Influencer, InfluencerType } from "@/lib/types";

export const createInfluencer = async (influencerData: Influencer) => {
  const userId = await getUserData();
  try {
    const create = await sql`INSERT INTO influencers (
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
        ) values (
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
          ${userId.user?.userId},
          ${influencerData.creator_name}
          ) RETURNING *`;

    return create[0];
  } catch (error) {
    return {
      status: 500,
      data: "Internal server Error",
    };
  }
};
export const updateInfluencer = async (influencerData: Influencer) => {
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
  try {
    console.log(influencerId);
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

export const getInfluencersByUserId = async () => {
  const user = await getUserData();

  if (user.status === 400) {
    return {
      status: 400,
      data: "Token not available",
    };
  }

  const influencers = await sql`SELECT * FROM influencers ORDER BY created_at`;

  return {
    status: 200,
    data: influencers,
  };
};
