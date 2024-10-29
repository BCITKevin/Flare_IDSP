import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getSignedURL, { getNewsFromDB } from "./actions";
import './news.css'
import ArticleCard from "@/components/news/ArticleCard";
import articles from "./mockData";

export default async function News() {


  const news = await fetchNews();


  const filterArticlesByScope = (scope: any) =>
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

                      <div key={articles[0].id} className="articleHighlight mt-6">
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

async function fetchNews() {
  const news = await getNewsFromDB();

  if (news !== undefined) {

    console.log(`Fetching from URL: ${news.url}`); // URL 확인
    const res = await fetch(news.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log('response: ', data);
  } else {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SECRET_KEY}&cx=${process.env.GOOGLE_SEARCH_CX}&q=Canada%20BC%20wildfire`
  
    const res = await fetch(url, {
      method: "GET",
    });
    
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      throw new Error('Failed to get news. Please try it again later');
    }
    
    console.log('data: ', data);
  
    if (data.items.length !== 0) {
      storeS3(res);
    }
  }
  
  async function storeS3(data: any) {

    const signedURLRequest = await getSignedURL(data);
  
    const { url } = signedURLRequest.success;
  
    await fetch(url, {
      method: "PUT",
      headers: {
      "Content-Type": "JSON",
      "Content-Length": JSON.stringify(data).length.toString(),
      },
      body: JSON.stringify(data)
    })
  }

}