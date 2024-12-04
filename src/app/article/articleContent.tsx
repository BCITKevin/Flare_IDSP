interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // 문단을 나누기
  const paragraphs = content.split(/\n\n+/); // 두 개 이상의 줄바꿈으로 문단 나누기

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
