"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getSignedURL, { getNewsFromDB } from "./actions";
import styles from './news.module.css'
import ArticleCard from "@/components/news/ArticleCard";
import Link from "next/link";
import { useState } from "react";
import BottomNavBar from "@/components/BottomNavBar"
import ArticleHighlight from "@/components/news/ArticleHighlight";

export default function News() {
    //dummy data
    const articles = [
        {
            id: 1,
            scope: "local",
            title: "Vancouver’s Unique Coastal Climate: A Balance of Rain and Mild Temperatures",
            date: "2024-10-15",
            description: "Exploring the influence of coastal climate on local weather patterns and seasonal changes.",
            author: "Jane Hartman",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            scope: "national",
            title: "National Wildfire Awareness Campaign",
            date: "2024-10-20",
            description: "Promoting wildfire prevention and response strategies across the country.",
            author: "Lina Mendez",
            image: "https://images.unsplash.com/photo-1602980068989-cb21869ab2c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lsZGZpcmV8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 3,
            scope: "global",
            title: "International Conference on Wildfire Mitigation",
            date: "2024-10-15",
            description: "World leaders and experts gather to address wildfire management and mitigation strategies.",
            author: "Amir Patel",
            image: "https://images.unsplash.com/photo-1552799446-159ba9523315?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            scope: "local",
            title: "Community Firebreak Initiative",
            date: "2024-10-18",
            description: "City council initiates a program to create firebreaks around vulnerable neighborhoods.",
            author: "Kayla Nguyen",
            image: "https://images.unsplash.com/photo-1567070694401-dd52d7b46429?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 5,
            scope: "national",
            title: "Federal Aid for Wildfire Relief Efforts",
            date: "2024-10-10",
            description: "Government announces funding for communities affected by recent wildfires.",
            author: "James Li",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVuZXdhYmxlfGVufDB8fDB8fHww"
        },
        {
            id: 6,
            scope: "global",
            title: "Global Wildfire Recovery Initiative",
            date: "2024-10-05",
            description: "A worldwide collaboration focused on restoring ecosystems damaged by wildfires.",
            author: "Sofia Rossi",
            image: "https://images.unsplash.com/photo-1496745109441-36ea45fed379?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 7,
            scope: "local",
            title: "Post-Fire Ecosystem Restoration in California",
            date: "2024-10-01",
            description: "Efforts to rehabilitate areas affected by wildfires and protect against soil erosion.",
            author: "Miguel Sanchez",
            image: "https://images.unsplash.com/photo-1508589066756-c5dfb2cb7587?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFya2V0fGVufDB8fDB8fHww"
        },
        {
            id: 8,
            scope: "regional",
            title: "Electric Vehicles Aid Wildfire Response",
            date: "2024-09-30",
            description: "Tax credits introduced for electric vehicles as part of wildfire emergency response.",
            author: "Priya Singh",
            image: "https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3RyaWMlMjBjYXJ8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 9,
            scope: "global",
            title: "Biodiversity Summit Focuses on Fire-Resistant Ecosystems",
            date: "2024-09-20",
            description: "Nations discuss preserving biodiversity through fire-resistant ecosystem designs.",
            author: "Emeka Okafor",
            image: "https://images.unsplash.com/photo-1683009427666-340595e57e43?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlvZGl2ZXJzaXR5fGVufDB8fDB8fHww"
        },
    ];
    const [tabState, setTabState] = useState("Local")

    const filterArticlesByScope = (scope: any) =>
        articles.filter((article) => article.scope === scope);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const data = await fetchNewsClient();

                await formatNews(data.items);

            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div >
            <div className="newsLayout">
                    <header className="">
                        <h1 className={`${styles.newsHeading}`}>News</h1>
                        <h4 className={`${styles.newsSubHeading} mt-5`}>Get the latest Information</h4>
                        <h4 className={`${styles.newsSubHeading} mb-5`}>Oct 20, 2024</h4>
                    </header>
                    <svg xmlns="http://www.w3.org/2000/svg" width="404" height="4" viewBox="0 0 404 4" fill="none">
                        <path d="M2 2H402" stroke="#00838F" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <Tabs defaultValue="Local" className="w-full flex flex-col">
                        <TabsList className={`grid-cols-4 ${styles.tabTriggerContainer}`}>
                            <TabsTrigger value="Local" className={styles.tabTrigger} onClick={() => setTabState("Local")}>Local</TabsTrigger>
                            <TabsTrigger value="Regional" className={styles.tabTrigger} onClick={() => setTabState("Regional")}>Regional</TabsTrigger>
                            <TabsTrigger value="National" className={styles.tabTrigger} onClick={() => setTabState("National")}>National</TabsTrigger>
                            <TabsTrigger value="Global" className={styles.tabTrigger} onClick={() => setTabState("Global")}>Global</TabsTrigger>
                        </TabsList>
                        <h2 className={`mt-3 ${styles.newsHeading}`}>{tabState}</h2>
                        <TabsContent value="Local">
                            {/** ALL OF ARTICLE HIGHLIGHT NEEDS TO BE A COMPONENT */}
                            <Link href="/article" className={`${styles.articleHighlight}`}>
                                <img
                                    src={articles[0].image}
                                    alt="news article"
                                    className={`rounded-lg ${styles.articleHighlightImage}`} />
                                <div className="indent-6">
                                    <h5 className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}>{articles[0].title}</h5>
                                    <div className="flex pb-3 text-gray-500">
                                        <p>{articles[0].author}</p>
                                        <p>{new Date(articles[0].date).toLocaleDateString()}</p>
                                        <p>Coastal Daily News</p>
                                    </div>
                                </div>
                            </Link>

                            {filterArticlesByScope("local").map((article) => (
                                <ArticleCard article={article} />
                            ))}
                        </TabsContent>

                        <TabsContent value="Regional">
                            <Link href="/article" key={articles[0].id} className={`${styles.articleHighlight} mt-6`}>
                                <img
                                    src={articles[1].image}
                                    alt="news article"
                                    className={`rounded-lg ${styles.articleHighlightImage}`} />
                                <div className="indent-6">
                                    <h5 className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}>{articles[0].title}</h5>
                                    <div className="flex pb-3 text-gray-500">
                                        <p>{articles[0].author}</p>
                                        <p>{new Date(articles[0].date).toLocaleDateString()}</p>
                                        <p>Coastal Daily News</p>
                                    </div>
                                </div>
                            </Link>

                            {filterArticlesByScope("regional").length > 0 ? (
                                filterArticlesByScope("regional").map((article) => (
                                    <ArticleCard article={article} />
                                ))
                            ) : (
                                <p>No regional news available.</p>
                            )}
                        </TabsContent>

                        <TabsContent value="National">
                            <Link href="/article" key={articles[0].id} className={`${styles.articleHighlight} mt-6`}>
                                <img
                                    src={articles[2].image}
                                    alt="news article"
                                    className={`rounded-lg ${styles.articleHighlightImage}`} />
                                <div className="indent-6">
                                    <h5 className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}>{articles[0].title}</h5>
                                    <div className="flex pb-3 text-gray-500">
                                        <p>{articles[0].author}</p>
                                        <p>{new Date(articles[0].date).toLocaleDateString()}</p>
                                        <p>Coastal Daily News</p>
                                    </div>
                                </div>
                            </Link>

                            {filterArticlesByScope("national").map((article) => (
                                <ArticleCard article={article} />
                            ))}
                        </TabsContent>

                        <TabsContent value="Global">
                            <Link href="/article" key={articles[0].id} className={`${styles.articleHighlight} mt-6`}>
                                <img
                                    src={articles[4].image}
                                    alt="news article"
                                    className={`rounded-lg ${styles.articleHighlightImage}`} />
                                <div className="indent-6">
                                    <h5 className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}>{articles[0].title}</h5>
                                    <div className="flex pb-3 text-gray-500">
                                        <p>{articles[0].author}</p>
                                        <p>{new Date(articles[0].date).toLocaleDateString()}</p>
                                        <p>Coastal Daily News</p>
                                    </div>
                                </div>
                            </Link>

                            {filterArticlesByScope("global").map((article) => (
                                <ArticleCard article={article} />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div> // div?
            <BottomNavBar />
        </div>
    )
}

