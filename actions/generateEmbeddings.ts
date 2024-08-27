"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  // protect this route with Clerk
  auth().protect();

  // turn pdf into embeddings
  console.log("yolooooooooooooo");
  await generateEmbeddingsInPineconeVectorStore(docId);
  console.log(" ======================================== ");
  revalidatePath("/dashboard");

  return { completed: true };
}
