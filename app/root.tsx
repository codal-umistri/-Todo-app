import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import MainNavigation from "~/components/MainNavigation";
import styles from "~/styles/main.css?url";
import { ReactNode } from "react";

export const meta = () => [
  {
    charset: "utf-8",
  },
  {
    title: "New Remix App",
  },
  {
    viewport: "width=device-width,initial-scale=1",
  },
];

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Layout({ children }: { children?: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <header>
          <MainNavigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
