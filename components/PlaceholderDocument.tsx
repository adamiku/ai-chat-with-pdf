"use client";

import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function PlaceholderDocument() {
  const router = useRouter();

  const handleClick = () => {
    // check if user is free tier and if they are over the file limit, push to the update page
    router.push(`/dashboard/upload`);
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400"
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p>Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
