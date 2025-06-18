import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";

import { getStoredNotes, storeNotes } from "~/data/notes";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes as Note[]} />
      <ErrorBoundary error={new Error("Test error")} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes." },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  return notes;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData) as { title: string };

  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title - must be at least 5 characters long." };
  }
  const existingNotes = await getStoredNotes();
  const noteWithId = {
    ...noteData,
    id: new Date().toISOString(),
  };
  const updatedNotes = existingNotes.concat(noteWithId);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

// export function meta() {
//   return {
//     title: "All Notes",
//     description: "Manage your notes with ease.",
//   };
// }

export function CatchBoundary() {
  const error = useRouteError();

  let message = "Data not found.";

  if (isRouteErrorResponse(error)) {
    message = error.data?.message || error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>!
      </p>
    </main>
  );
}
