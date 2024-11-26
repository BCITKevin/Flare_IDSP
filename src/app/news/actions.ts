// import * as cheerio from 'cheerio';

// const encodedString = encodeURI('BC wildfire%');
// const AXIOS_OPTIONS = {
//     headers: {
//         "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
//     },
//     params: {
//         q: encodedString,
//         tbm: "nws",
//         hl: 'en',
//         gl: 'us'
//     },
// };

// async function getNewsInfo() {
//     const response = await fetch('http://google.com/search', AXIOS_OPTIONS);
//     const data = await response.text();
    
//     let $ = cheerio.load(data);
//     const pattern = /s='(?<img>[^']+)';\w+\s\w+=\['(?<id>\w+_\d+)'];/gm;

//     const images = [...data.matchAll(pattern)].map((match) => ({ 
//         id: match.groups?.id, 
//         img: match.groups?.img.replace('\\x3d', '') || "No image"
//     }));

//     const allNewsInfo = Array.from($('.WlydOe')).map((el) => {
//         return {
//             link: $(el).attr('href'),
//             source: $(el).find('.CEMjEf span').text().trim(),
//             title: $(el).find('.mCBkyc').text().trim().replace('\n', ''),
//             snippet: $(el).find('.GI74Re').text().trim().replace('\n', ''),
//             image: images.find(({ id, img }) => id === $(el).find('.uhHOwf img').attr('id'))?.img || "No image",
//             date: $(el).find('.ZE0LJd span').text().trim(),
//         };
//     });

//     return allNewsInfo;
// }

// export default async function formatNews(news: any[]) {

//     const url = `https://api.scraperapi.com/?api_key=${process.env.NEXT_PUBLIC_SCRAPER_API_KEY}&url=${news[0].link}&autoparse=true&country_code=us`;

//     const res = await fetch(url)
        
//     if (res.ok) {
//         const html = await res.text();
//         const $ = cheerio.load(html);


        
//         console.log(news[1].link);
//         console.log($.html());
        
        

//     }

//     // for (const aNews of news) {
//     // }
// }