import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "../components/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList";

import { getStoredNotes, storeNotes } from "../data/notes";

interface Note {
  id: string;
  title: string;
  content: string;
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
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
  return { notes };
}

export default function NotesPage() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <>
      <NewNote />
      <NoteList notes={notes as Note[]} />
    </>
  );
}
