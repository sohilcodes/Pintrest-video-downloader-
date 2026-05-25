import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required hai bhai" }, { status: 400 });
  }

  const pinterestRegex = /pinterest\.(com|co\.uk|ca|au|in|fr|de|es|it|jp|kr|br|mx|nz|at|be|ch|dk|fi|no|se|nl|pt|ru|pl|ar|cl|co|pe|ph|sg|th|tw|za)\//i;
  if (!pinterestRegex.test(url)) {
    return NextResponse.json({ error: "Valid Pinterest URL dalo bhai" }, { status: 400 });
  }

  try {
    const apiUrl = `https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
        "x-rapidapi-host": process.env.RAPIDAPI_HOST || "pinterest-video-and-image-downloader.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Kuch gadbad ho gayi, dobara try karo" },
      { status: 500 }
    );
  }
}
