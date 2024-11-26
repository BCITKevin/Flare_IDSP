import "./page.css";
import Image from "next/image";

interface ArticleHeroProps {
  imageUrl: string;
}

export default function ArticleHero({ imageUrl }: ArticleHeroProps) {
  return (
    <div className="relative h-60 w-full overflow-hidden">
      <div className="h-full w-full">
        <div className="h-[80%] w-full bg-cover bg-center bg-no-repeat">
          <Image
            src={imageUrl}
            alt="Article hero image"
            className="h-full w-full object-cover"
            width={800}
            height={400}
          />
        </div>
        <div className="absolute bottom-0 w-full">
          <p className="caption">Article image</p>
        </div>
      </div>
    </div>
  );
}
