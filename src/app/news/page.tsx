import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import './news.css'
import ArticleCard from "@/components/news/ArticleCard";

export default function News() {
    const articles = [
        {
            id: 1,
            scope: "local",
            title: "Local Park Cleanup",
            date: "2024-10-25",
            description: "A community initiative to clean up the local park.",
        },
        {
            id: 2,
            scope: "national",
            title: "National Wildfire Awareness",
            date: "2024-10-20",
            description: "Raising awareness about wildfire prevention across the country.",
        },
        {
            id: 3,
            scope: "global",
            title: "Climate Change Conference",
            date: "2024-10-15",
            description: "World leaders gather to discuss climate change.",
        },
    ];

    // Filter articles by scope
    const filterArticlesByScope = (scope) =>
        articles.filter((article) => article.scope === scope);

    return (
        <body>
            <div className="appLayout">
                <header>
                    <h1>News</h1>
                    <h3>Get the latest Information</h3>
                    <h3>Oct 20, 2024</h3>
                </header>
                <svg xmlns="http://www.w3.org/2000/svg" width="404" height="4" viewBox="0 0 404 4" fill="none">
                    <path d="M2 2H402" stroke="#00838F" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <div className="mt-8">
                    <Tabs defaultValue="Local" className="w-full flex flex-col">
                        <TabsList>
                            <TabsTrigger value="Local" className="">Local</TabsTrigger>
                            <TabsTrigger value="Regional">Regional</TabsTrigger>
                            <TabsTrigger value="National">National</TabsTrigger>
                            <TabsTrigger value="Global">Global</TabsTrigger>
                        </TabsList>

                        {/** TEMPORARY CODE TO DISPLAY NEWS ARTICLES. MEANT FOR SHOWCASE PURPOSES ONLY IT DOES NOT WORK WITH THE API */}

                        <TabsContent value="Local">
                            {filterArticlesByScope("local").map((article) => (
                                <ArticleCard article={article} />
                            ))}
                        </TabsContent>

                        <TabsContent value="Regional">
                            {filterArticlesByScope("regional").length > 0 ? (
                                filterArticlesByScope("regional").map((article) => (
                                    <ArticleCard article={article} />
                                ))
                            ) : (
                                <p>No regional news available.</p>
                            )}
                        </TabsContent>

                        <TabsContent value="National">
                            {filterArticlesByScope("national").map((article) => (
                                <ArticleCard article={article} />

                            ))}
                        </TabsContent>

                        <TabsContent value="Global">
                            {filterArticlesByScope("global").map((article) => (
                                <ArticleCard article={article} />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </body>
    );
}
