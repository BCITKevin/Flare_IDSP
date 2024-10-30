import "../../app/news/news.css"

export default function articleCard({ article }) {
    return (
        <div key={article.id} className=" articleCardContainer">
            <img
                src={article.image}
                alt="news article"
                className="rounded-lg articleImage" />
            <div>
                <h2 className="text-xl font-bold articleTitle pb-2 pr-3">{article.title}</h2>
                <div className="flex space-x-0.5 text-gray-500 ">
                    <p className="" >{new Date(article.date).toLocaleDateString()}</p>
                    <p className="">|</p>
                    <p className="">{article.author}</p>
                </div>
            </div>
        </div>
    );
}