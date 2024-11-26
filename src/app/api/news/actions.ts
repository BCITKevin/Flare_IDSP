import { z } from "zod";
import fetch from "node-fetch";

// 환경 변수 검증
const EnvSchema = z.object({
  BING_NEWS_API_KEY: z.string(),
  NEXT_PUBLIC_BING_NEWS_ENDPOINT: z.string().url(),
});
const env = EnvSchema.parse(process.env);

// Bing News API 응답 스키마
const BingNewsResponseSchema = z.object({
  value: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
      image: z
        .object({
          thumbnail: z
            .object({
              contentUrl: z.string().url(),
              width: z.number().optional(),
              height: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
      description: z.string(),
      provider: z.array(z.object({ name: z.string() })),
      datePublished: z.string(),
    })
  ),
});

export interface BingNewsArticle {
  name: string;
  url: string;
  image?: {
    thumbnail?: {
      contentUrl: string;
      width?: number;
      height?: number;
    };
  };
  description: string;
  provider: { name: string }[];
  datePublished: string;
  content?: string; // 전체 기사 내용
}

export interface BingNewsResponse {
  value: BingNewsArticle[];
}

// 뉴스 기사 가져오기 함수
export async function fetchNews(
  query: string,
  market: string = "en-CA"
): Promise<BingNewsResponse> {
  console.log(`Fetching news for query: ${query}, market: ${market}`); // 추가된 로그
  const { BING_NEWS_API_KEY, NEXT_PUBLIC_BING_NEWS_ENDPOINT } = env;

  const url = `${NEXT_PUBLIC_BING_NEWS_ENDPOINT}?q=${encodeURIComponent(
    query
  )}&mkt=${market}&count=10`;

  console.log("Request URL:", url); // 추가된 로그

  const response = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": BING_NEWS_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Bing News API 요청 실패: ${response.statusText}. 상세 내용: ${errorText}`
    );
    throw new Error(
      `Bing News API 요청 실패: ${response.statusText}. 상세 내용: ${errorText}`
    );
  }

  const data = await response.json();
  const parsedData = BingNewsResponseSchema.parse(data); // 응답 데이터 검증
  console.log("Bing News API 응답 데이터 파싱 완료");

  return { value: parsedData.value }; // 스크래핑 없이 기사 데이터 반환
}
