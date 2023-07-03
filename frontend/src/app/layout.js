import { AuthProvider } from "context/auth";
import "../styles/global.css";

import { AccountProvider } from "context/account";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AccountProvider>
          <AuthProvider>{children}</AuthProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
