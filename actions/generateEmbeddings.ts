"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  // protect this route with Clerk
  auth().protect();

  // turn pdf into embeddings

  revalidatePath("/dashboard");

  return { completed: true };
}
