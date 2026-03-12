import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// READ
export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      published: body.published ?? false,
      authorId: body.authorId,
    },
  });

  return NextResponse.json(post);
}

// UPDATE
export async function PUT(req: Request) {
  const body = await req.json();

  const post = await prisma.post.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
      published: body.published,
    },
  });

  return NextResponse.json(post);
}

// DELETE
export async function DELETE(req: Request) {
  const body = await req.json();

  await prisma.post.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ success: true });
}