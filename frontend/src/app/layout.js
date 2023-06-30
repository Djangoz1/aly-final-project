import { AuthProvider } from "context/auth";
import "../styles/global.css";
import { MissionProvider } from "context/authMissions";

import { AccountProvider } from "context/account";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AccountProvider>
          <AuthProvider>
            <MissionProvider>{children}</MissionProvider>
          </AuthProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
