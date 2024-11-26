interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="content my-4">
      <p className="mb-6">{content}</p>
    </div>
  );
}
