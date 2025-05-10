import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { postPatchSchema } from "@/lib/validations/post";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const routeContextSchema = z.object({
  params: z.promise(
    z.object({
      postId: z.string(),
    })
  ),
});

export async function PATCH(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // parseAsyncは非同期で動作する
    // context.paramsがPromiseであることを検証
    // そのPromiseが解決されるのを待機
    // 解決された値が{ postId: string }の形式であることを検証
    const { params } = await routeContextSchema.parseAsync(context);
    const { postId } = await params;

    if (!(await verifyCurrentUserHasAccessToPost(postId))) {
      return NextResponse.json(null, { status: 403 });
    }

    const json = await req.json();
    const body = postPatchSchema.parse(json);

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    } else {
      return NextResponse.json(null, { status: 500 });
    }
  }
}

export async function DELETE(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // parseAsyncは非同期で動作する
    // context.paramsがPromiseであることを検証
    // そのPromiseが解決されるのを待機
    // 解決された値が{ postId: string }の形式であることを検証
    const { params } = await routeContextSchema.parseAsync(context);
    const { postId } = await params;

    if (!(await verifyCurrentUserHasAccessToPost(postId))) {
      return NextResponse.json(null, { status: 403 });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    } else {
      return NextResponse.json(null, { status: 500 });
    }
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions);
  const count = await db.post.count({
    where: {
      id: postId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}
