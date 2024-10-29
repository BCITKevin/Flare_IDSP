export default function articleCard({ article }) {
    return (
        <div key={article.id} className="border p-4 rounded-lg mb-4 bg-gray-100">
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-gray-500">{new Date(article.date).toLocaleDateString()}</p>
            <p>{article.description}</p>
        </div>
    );
}