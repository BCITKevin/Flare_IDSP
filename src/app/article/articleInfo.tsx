import "./page.css"

interface ArticleInfoProps {
    title: string;
    date: string;
    author: string;
    source: string;
}

export default function ArticleInfo({ title, date, author, source }: ArticleInfoProps) {
    return(
        <div className="flex-col items-start shrink-0">
            <div className="gap-2 self-stretch">
                <h2 className="articleTitle">{title}</h2>
            </div>
            <div className="h-11 flex self-stretch items-center justify-between">
                <p className="author">{date} | {author}</p>
                <p className="org">{source}</p>
            </div>
        </div>        
    );
}