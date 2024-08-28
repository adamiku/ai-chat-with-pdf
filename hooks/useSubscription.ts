"use client";

import { FREE_DOCUMENT_LIMIT, PRO_DOCUMENT_LIMIT } from "@/constant";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);

  const { user } = useUser();

  // Listen to the user document
  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [fileSnapshot, filesLoading, filesError] = useCollection(
    user && collection(db, "users", user.id, "files")
  );

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();

    if (!data) return;

    setHasActiveMembership(data.hasActiveMembership);
  }, [snapshot]);

  useEffect(() => {
    if (!fileSnapshot || hasActiveMembership === null) return;

    const files = fileSnapshot.docs;

    const usersLimit = hasActiveMembership
      ? PRO_DOCUMENT_LIMIT
      : FREE_DOCUMENT_LIMIT;

    setIsOverFileLimit(files.length >= usersLimit);
  }, [fileSnapshot, hasActiveMembership]);

  return {
    hasActiveMembership,
    isOverFileLimit,
    loading,
    error,
    filesLoading,
    filesError,
  };
}

export default useSubscription;
