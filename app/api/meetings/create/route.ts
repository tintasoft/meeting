import { NextResponse, NextRequest } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server/client";

export async function POST(request: NextRequest) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await currentUser();

  const body = await request.json();
  const { instant } = body;

  const meetingId = generateMeetingId();

  const client = createServerSupabaseClient();

  try {
    const { error } = await client.from("meetings").insert({
      instant,
      code: meetingId,
      owner_id: user?.id,
    });

    if (error) {
      throw error;
    }

    console.log("meeting created");

    return NextResponse.json({ id: meetingId }, { status: 200 });
  } catch (err) {
    console.error("failed to create meeting", err);

    return NextResponse.json(
      { message: "failed to create meeting" },
      { status: 500 }
    );
  }
}

function generateMeetingId(): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const patterns = [
    () =>
      `${randomChars(letters, 3)}-${randomChars(
        letters + numbers,
        4
      )}-${randomChars(letters + numbers, 4)}`,
    () =>
      `${randomChars(letters, 3)}-${randomChars(numbers, 3)}-${randomChars(
        letters + numbers,
        4
      )}`,
    () =>
      `${randomChars(letters + numbers, 3)}-${randomChars(
        letters + numbers,
        4
      )}-${randomChars(letters, 3)}`,
  ];

  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
  return randomPattern();
}

function randomChars(charSet: string, length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return result;
}
