import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Document from "./Document";
import PlaceholderDocument from "./PlaceholderDocument";

async function Documents() {
  auth().protect();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const documentSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
      {documentSnapshot.docs.map((doc) => {
        const { name, downloadURL, size } = doc.data();
        return (
          <Document
            key={doc.id}
            id={doc.id}
            downloadURL={downloadURL}
            size={size}
            name={name}
          />
        );
      })}
      <PlaceholderDocument />
    </div>
  );
}

export default Documents;
