interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="content my-4">
      {content.split('\n').map((paragraph, index) => (
        paragraph.trim() && (
          <p key={index} className="mb-6">
            {paragraph}
          </p>
        )
      ))}
    </div>
  );
}
