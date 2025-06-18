import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "../data/notes";
import styles from "../styles/note-details.css?url";

interface Note {
  id: string;
  title: string;
  content: string;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ params }: { params: { noteId: string } }) {
  try {
    const notes = await getStoredNotes();
    const noteId = params.noteId;

    if (!noteId) {
      throw new Error("No note ID provided");
    }

    const selectedNote = notes.find((note: Note) => note.id === noteId);

    if (!selectedNote) {
      throw json(
        { message: `Could not find note for id ${noteId}` },
        { status: 404 }
      );
    }

    return json({ note: selectedNote });
  } catch (error) {
    console.error("Error loading note:", error);
    throw json({ message: "Failed to load note" }, { status: 500 });
  }
}

export default function NoteDetailsPage() {
  console.log("NoteDetailsPage : ");
  const { note }: { note: Note } = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}
