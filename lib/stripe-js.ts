import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

if (!process.env.NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY) {
  throw new Error("Stripe key is not set");
}

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY!);
  }
  return stripePromise;
};

export { getStripe };
