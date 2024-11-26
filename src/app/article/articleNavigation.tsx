import "./page.css";
import { CircleArrowLeft } from "lucide-react";

interface ArticleNavigationProps {
    source: string;
}

export default function ArticleNavigation({ source }: ArticleNavigationProps) {
    return (
        <div className="headColor flex stickyNav justify-between items-center">
            <CircleArrowLeft className="arrow shrink-0" />
            <h4 className="newsOrg">{source}</h4>
        </div>
    );
}