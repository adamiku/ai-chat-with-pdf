"use server";

import { Message } from "@/components/Chat";
import { FREE_MESSAGE_LIMIT, PRO_MESSAGE_LIMIT } from "@/constant";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  const userRef = await adminDb.collection("users").doc(userId!).get();

  const hasActiveMembership = userRef.data()?.hasActiveMembership;
  const messageLimit = hasActiveMembership
    ? PRO_MESSAGE_LIMIT
    : FREE_MESSAGE_LIMIT;

  if (userMessages.length >= messageLimit) {
    const message = hasActiveMembership
      ? `You've reached the PRO limit of ${PRO_MESSAGE_LIMIT} questions per document.`
      : `You'll need to upgrade to PRO to ask more than ${FREE_MESSAGE_LIMIT} questions.`;

    return {
      success: false,
      message,
    };
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return { success: true, message: null };
}
