import "./page.css";
import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArticleNavigationProps {
  source: string;
}

export default function ArticleNavigation({ source }: ArticleNavigationProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // This navigates to the previous page
  };

  return (
    <div className="headColor flex stickyNav justify-between items-center">
      <CircleArrowLeft 
        className="arrow shrink-0 cursor-pointer" 
        onClick={handleGoBack} 
      />
      <h4 className="newsOrg">{source}</h4>
    </div>
  );
}