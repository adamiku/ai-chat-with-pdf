"use server";

import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createStripePortal() {
  auth().protect();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await adminDb.collection("users").doc(userId).get();
  const stipeCustomerId = user.data()?.stripeCustomerId;

  const session = await stripe.billingPortal.sessions.create({
    customer: stipeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });

  return session.url;
}
