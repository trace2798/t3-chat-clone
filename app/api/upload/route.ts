import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  if (!file) {
    return NextResponse.json({ success: false });
  }
  console.log("File", file);
  return NextResponse.json({ success: true });
}
