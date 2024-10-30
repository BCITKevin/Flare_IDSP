import "./page.css"
import Image from "next/image";
import Hero from "../public/images/fire.jpg"

export default function ArticleHero(){

    return(
        <div className="relative h-60 w-full overflow-hidden">
            <div className="h-full w-full">
                <div className="h-[80%] w-full bg-cover bg-center bg-no-repeat">
                    <Image 
                        src={Hero} 
                        alt="fire approaches a lake in the night" 
                        className="h-full w-full object-cover"
                    />
                    </div>
                    <div className="absolute bottom-0 w-full">
                    <p className="caption">The fire approaches a Lake in Breakneck Ridge</p>
                </div>
            </div>
        </div>
    );
}