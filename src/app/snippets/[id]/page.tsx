import Link from "next/link";
import { Snippet } from "@prisma/client";
import { db } from "@/db";
import { deleteSnippet } from "@/actions";
import { notFound } from "next/navigation";

interface SnippetsShowPageProps {
  params: {
    id: string;
  };
}

export default async function SnippetsShowPage({
  params,
}: SnippetsShowPageProps) {
  //find snippet by id
  const snippet = await db.snippet.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!snippet) {
    return notFound();
  }

  // console.log({ params, snippet });
  const deleteSnippetAction = deleteSnippet.bind(null, snippet.id);
  return (
    <div>
      <div className="flex m-4 justify-between items-center">
        <h1 className="text-xl font-bold">{snippet.title}</h1>
        <div className="flex gap-4">
          <Link
            className="p-2 border rounded"
            href={`/snippets/${snippet.id}/edit`}
          >
            Edit
          </Link>
          <form action={deleteSnippetAction}>
            <button className="p-2 border rounded">Delete</button>
          </form>
        </div>
      </div>
      <pre className="p-3 border rounded bg-gray-200 border-gray-200">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

export async function generateStaticParams() {
  //retrieve all snippets currenly in the DB at build time to generate cached URLs
  const snippets = await db.snippet.findMany();

  return snippets.map((snippet: Snippet) => {
    return {
      id: snippet.id.toString(),
    };
  });
}
