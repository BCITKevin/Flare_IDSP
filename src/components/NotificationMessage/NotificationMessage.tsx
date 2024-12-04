import { Card } from "../ui/card"
import Image from "next/image"
import Link from "next/link"
import styles from "./NotificationMessage.module.css"
import { useRouter } from "next/navigation"
import { demoArticles } from "@/data/demoArticles"

export default function NotificationMessage() {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const firstArticle = demoArticles.LocalArticles[0];
        
        const formattedContent = firstArticle.content.paragraphs
            .map((paragraph: string) => {
                const trimmedParagraph = paragraph.trim();
                if (trimmedParagraph.startsWith('"') || trimmedParagraph.startsWith('"')) {
                    return `"${trimmedParagraph.replace(/^[""]|[""]$/g, '')}"\n`;
                }
                return `${trimmedParagraph}\n`;
            })
            .join("\n");

        const articleData = {
            title: firstArticle.title,
            content: formattedContent,
            date: firstArticle.date,
            author: firstArticle.author,
            image: firstArticle.image,
            source: firstArticle.publisher,
            imageDescription: firstArticle.imageDescription || "",
        };

        localStorage.setItem("articleData", JSON.stringify(articleData));
        router.push("/demoArticle");
    };

    return (
        <Link href={"/news"} className={`${styles.notiLink}`} onClick={handleClick}>
            <div className={`${styles.notifyMessage}`}>
                <h5 className="mb-2">
                    New Article
                </h5>
                <div className="flex">
                    <Image
                        className={`${styles.notifyImage} mr-2`}
                        width={50}
                        height={50}
                        alt="Fire in Vernon"
                        src={"https://images.pexels.com/photos/948270/pexels-photo-948270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} />
                    <p>
                        Wildfire Erupts in Vernon!
                    </p>
                </div>
            </div>
        </Link>
    )
}