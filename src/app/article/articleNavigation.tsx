import "./page.css";
import { CircleArrowLeft } from "lucide-react";


export default function ArticleNavigation() {
    return (
        <div className="headColor flex stickyNav justify-between items-center">
            <CircleArrowLeft className="arrow shrink-0" />
            <h4 className="newsOrg">Coastal News</h4>
        </div>
    );
}