import { Card } from "../ui/card"
import Image from "next/image"
import Link from "next/link"
import styles from "./NotificationMessage.module.css"

export default function NotificationMessage() {
    return (
        <Link href={"/news"} className={`${styles.notiLink}`}>
            <div className={`${styles.notifyMessage}`}>
                <h5 className="mb-2">
                    New Article!
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