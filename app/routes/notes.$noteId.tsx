import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

import { getStoredNotes } from "~/data/notes";
import styles from "~/styles/note-details.css?url";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NoteDetailsPage() {
  console.log("NoteDetailsPage");
  const { note }: { note: Note } = useLoaderData();
  console.log("from main component", note);

  return (
    <main id="note-details">
      <header>
        <nav>
          <NavLink to="/notes">Back to all Notes</NavLink>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export async function loader({ params }: { params: { noteId: string } }) {
  try {
    // console.log("Loading note with ID:", params.noteId);
    const notes = await getStoredNotes();
    // console.log("All notes:", notes);
    const noteId = params.noteId;

    if (!noteId) {
      throw new Error("No note ID provided");
    }

    const selectedNote = notes.find((note: Note) => note.id === noteId);
    // console.log("Selected note:", selectedNote);

    if (!selectedNote) {
      throw json(
        { message: `Could not find note for id ${noteId}` },
        { status: 404 }
      );
    }

    console.log("Loader noteId:");

    // return json(selectedNote);
    return json({ note: selectedNote });
  } catch (error) {
    console.error("Error loading note:", error);
    throw json({ message: "Failed to load note" }, { status: 500 });
  }
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <main className="error">
      <h1>Error loading note</h1>
      <p>{error.message}</p>
      <p>
        <NavLink to="/notes">Back to all notes</NavLink>
      </p>
    </main>
  );
}
