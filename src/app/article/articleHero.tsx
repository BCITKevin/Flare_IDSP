import "./page.css";
import Image from "next/image";

interface ArticleHeroProps {
  imageUrl: string | null;
}

export default function ArticleHero({ imageUrl }: ArticleHeroProps) {
  if (!imageUrl) return null;

  return (
    <div className="article-hero">
      <div className="relative w-full h-[400px]">
        <Image 
          src={imageUrl}
          alt="Article hero"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
