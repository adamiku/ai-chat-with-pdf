type Props = {
  params: {
    id: string;
  };
};

function ChatToFilePage({ params: { id } }: Props) {
  return <div>ChatToFilePage {id}</div>;
}

export default ChatToFilePage;
