import "./page.css"

export default function ArticleInfo() {

    return (
        <div className="flex-col items-start shrink-0">
            <div className="gap-2 self-stretch">
                {/* can be changed to {area} */}
                <h3 className="area">Local</h3>
                <h2 className="articleTitle">Vancouver&apos;s Unique Coastal Climate: A Balance of Rain and Mild Temperatures</h2>
            </div>
            <div className="h-11 flex self-stretch items-center justify-between">
                <p className="author">Oct 15, 2024 | Jane Hartman</p>
                <p className="org">Coastal News</p>
            </div>
        </div>
    );
}