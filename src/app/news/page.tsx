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
            author: "Saed Crytsron",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            scope: "national",
            title: "National Wildfire Awareness",
            date: "2024-10-20",
            description: "Raising awareness about wildfire prevention across the country.",
            author: "Lina Mendez",
            image: "https://images.unsplash.com/photo-1602980068989-cb21869ab2c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lsZGZpcmV8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 3,
            scope: "global",
            title: "Climate Change Conference",
            date: "2024-10-15",
            description: "World leaders gather to discuss climate change.",
            author: "Amir Patel",
            image: "https://images.unsplash.com/photo-1552799446-159ba9523315?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            scope: "local",
            title: "New Bike Lanes Initiative",
            date: "2024-10-18",
            description: "City council approves new bike lanes to improve urban mobility.",
            author: "Kayla Nguyen",
            image: "https://images.unsplash.com/photo-1567070694401-dd52d7b46429?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 5,
            scope: "national",
            title: "Renewable Energy Subsidies",
            date: "2024-10-10",
            description: "Government announces subsidies for solar panel installations.",
            author: "James Li",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVuZXdhYmxlfGVufDB8fDB8fHww"
        },
        {
            id: 6,
            scope: "global",
            title: "Oceans Cleanup Project",
            date: "2024-10-05",
            description: "An international effort to remove plastic waste from oceans.",
            author: "Sofia Rossi",
            image: "https://plus.unsplash.com/premium_photo-1673532262644-13f34db9fb29?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D"
        },
        {
            id: 7,
            scope: "local",
            title: "Farmers Market Returns",
            date: "2024-10-01",
            description: "The seasonal farmers market reopens with fresh, local produce.",
            author: "Miguel Sanchez",
            image: "https://images.unsplash.com/photo-1508589066756-c5dfb2cb7587?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFya2V0fGVufDB8fDB8fHww"
        },
        {
            id: 8,
            scope: "regional",
            title: "Electric Vehicle Tax Credit in Wildfires",
            date: "2024-09-30",
            description: "New tax credits introduced for electric vehicle purchases.",
            author: "Priya Singh",
            image: "https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3RyaWMlMjBjYXJ8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 9,
            scope: "global",
            title: "Biodiversity Summit",
            date: "2024-09-20",
            description: "Nations convene to discuss preserving global biodiversity.",
            author: "Emeka Okafor",
            image: "https://images.unsplash.com/photo-1683009427666-340595e57e43?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlvZGl2ZXJzaXR5fGVufDB8fDB8fHww"
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
                    <h4>Get the latest Information</h4>
                    <h4>Oct 20, 2024</h4>
                </header>
                <svg xmlns="http://www.w3.org/2000/svg" width="404" height="4" viewBox="0 0 404 4" fill="none">
                    <path d="M2 2H402" stroke="#00838F" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <div className="mt-8">
                    <Tabs defaultValue="Local" className="w-full flex flex-col">
                        <TabsList className="grid-cols-4 tabTriggerContainer">
                            <TabsTrigger value="Local" className="tabTrigger">Local</TabsTrigger>
                            <TabsTrigger value="Regional" className="tabTrigger">Regional</TabsTrigger>
                            <TabsTrigger value="National" className="tabTrigger">National</TabsTrigger>
                            <TabsTrigger value="Global" className="tabTrigger">Global</TabsTrigger>
                        </TabsList>

                        {/** TEMPORARY CODE TO DISPLAY NEWS ARTICLES. MEANT FOR SHOWCASE PURPOSES ONLY IT DOES NOT WORK WITH THE API */}

                        <div key={articles.id} className="articleHighlight mt-6">
                            <img
                                src={'https://picsum.photos/200/300'}
                                alt="news article"
                                className="rounded-lg articleHighlightImage" />
                            <div className="indent-6">
                                <h5 className="text-xl font-bold articleHighlightTitle mt-6">{articles[1].title}</h5>

                                <div className="flex pb-6 space-x-0 > * + *">
                                    <p className="text-gray-500" >{new Date(articles[1].date).toLocaleDateString()}</p>
                                    <p className="text-gray-500" > |</p>
                                    <p className="text-gray-500" >{articles[0].author}</p>
                                </div>
                            </div>
                        </div>

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
