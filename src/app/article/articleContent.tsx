interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="content my-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
