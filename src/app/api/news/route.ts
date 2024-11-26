import { NextResponse } from "next/server";
import { fetchNews } from "./actions"; // actions.ts에서 fetchNews 함수 가져오기

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "BC wildfires"; // 기본 쿼리 설정
  const market = searchParams.get("mkt") || "en-CA"; // 기본 마켓 설정

  try {
    const newsResponse = await fetchNews(query, market);
    return NextResponse.json(newsResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
