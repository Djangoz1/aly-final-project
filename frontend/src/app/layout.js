import { AuthProvider } from "context/auth";
import "../styles/global.css";

import { AccountProvider } from "context/account";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AccountProvider>
          <AuthProvider>{children}</AuthProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
