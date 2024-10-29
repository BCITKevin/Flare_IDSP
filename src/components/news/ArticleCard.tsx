import Image from "next/image";
import "../../app/news/news.css"

export default function articleCard({ article }) {
    return (
        <div key={article.id} className="border p-4 rounded-lg mb-4 bg-gray-100 flex">
            <img
                src={'https://picsum.photos/200/300'}
                alt="news article"
                className="rounded-lg mb-2 articleImage" />
            <div>
                <h2 className="text-xl font-bold">{article.title}</h2>
                <p className="text-gray-500">{new Date(article.date).toLocaleDateString()}</p>
                <p>{article.description}</p>
            </div>
        </div>
    );
}