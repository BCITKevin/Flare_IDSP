import { Button } from "@/components/ui/button";
import Image from "next/image";
import articles from "../mockData";
import btn from "@/app/public/images/arrow_left_circle.svg";

interface NewsPageProps {
    params: { newsId: string };
}

export default function newsPage({ params }: NewsPageProps) {
    const article = articles.find((a) => String(a.id) === params.newsId);
    
    if (!article) return <div>Article not found</div>;
    
    return (
        <div className="p-5">
            <a href="/news">
                <Image src={btn} alt="arrow-left-circle" width={40} height={40}/>
            </a>
            <h3 className="text-orange-600 font-semibold mt-5">{article.scope}</h3>
            <h2 className="text-white font-bold">{article.title}</h2>
            <div>
                <p className="text-white">{article.date} | {article.author}</p>
            </div>
            <img src={article.image} alt="article image" />
            <div className="border-t border-white mt-5"></div>
            <div className="mt-2">
                <p className="text-white">{article.content}</p>
            </div>
        </div>
    )
}