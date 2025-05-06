import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const postCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { user } = session;
    const json = await req.json();
    const body = postCreateSchema.parse(json);
    const { title, content } = body;

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.issues, { status: 422 });
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
