import { Link } from "@remix-run/react";

import styles from "./NoteList.css?url";

interface Note {
  id: string;
  title: string;
  content: string;
}

function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ul id="note-list">
      {notes.map((note: Note, index: number) => (
        <li key={note.id} className="note">
          <Link to={note.id} prefetch="intent">
            <article>
              <header>
                <ul className="note-meta">
                  <li>#{index + 1}</li>
                  <li>
                    <time dateTime={note.id}>
                      {new Date(note.id).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </li>
                </ul>
                <h2>{note.title}</h2>
              </header>
              <p>{note.content}</p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
