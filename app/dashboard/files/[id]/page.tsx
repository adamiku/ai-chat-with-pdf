import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: {
    id: string;
  };
};

async function ChatToFilePage({ params: { id } }: Props) {
  auth().protect();
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadURL;
  console.log(url);
  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">Chat</div>
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        <PdfView url={url} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
