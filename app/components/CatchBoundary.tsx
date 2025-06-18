import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import NewNote from "./NewNote";

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
