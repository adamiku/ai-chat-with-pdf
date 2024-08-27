"use client";

import { askQuestion } from "@/actions/askQuestion";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

type Props = {
  id: string;
};

function Chat({ id }: Props) {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (!snapshot) return;

    console.log("Updated snapshot", snapshot.docs);

    const lastMessage = messages.pop();

    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return { id: doc.id, role, message, createdAt: createdAt.toDate() };
    });

    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();

    setInput("");

    // optimistic ui update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      if (!success) {
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Whoops... ${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className="flex-1 w-full">
        {messages.map((message) => (
          <div className="" key={message.id}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
      >
        <Input
          placeholder="Ask a Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button disabled={!input || isPending}>Ask</Button>
      </form>
    </div>
  );
}

export default Chat;
