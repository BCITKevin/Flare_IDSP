import "../../app/news/news.css"

export default function articleCard({ article }: { article: any }) {
    return (
        <a href={`/news/${article.id}`}>
            <div key={article.id} className="articleCardContainer">
                <img
                    src={article.image}
                    alt="news article"
                    className="rounded-lg articleImage" />
                <div>
                    <h2 className="text-xl font-bold articleTitle">{article.title}</h2>
                    <div className="flex space-x-0.5">
                        <p className="text-gray-500" >{new Date(article.date).toLocaleDateString()}</p>
                        <p className="text-gray-500">|</p>
                        <p className="text-gray-500">{article.author}</p>
                    </div>
                </div>
            </div>
        </a>
    );
}