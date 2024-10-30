import "./page.css";

import ArticleNavigation from "./articleNavigation";
import ArticleInfo from "./articleInfo";
import ArticleHero from "./articleHero";
import ArticleContent from "./articleContent";

export default function article() {
    
    
    return(
        <div className="appLayout flex-col">
            <div className=" flex-col max-w-[850px] mx-auto w-full">
                <ArticleNavigation/>
                <ArticleInfo />
                <ArticleHero />
                <ArticleContent />
            </div>
        </div>

    );
}