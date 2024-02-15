"use server";

import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editSnippet(id: number, code: string) {
  // console.log("edit snippet called", { id, code });
  await db.snippet.update({
    where: {
      id,
    },
    data: { code },
  });
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  console.log("deleting snippet with id: ", id);
  await db.snippet.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  redirect(`/`);
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  //Check the user's inputs and make sure they are valid
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;

  try {
    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }

    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }

    const snippet = await db.snippet.create({
      data: {
        title,
        code,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    } else {
      return {
        message: "Something went wrong",
      };
    }
  }
  //invalidate cache ans show new changes
  revalidatePath("/");
  // Redirect user back to the root route of applicaiton
  redirect("/");
}
