import { AuthProvider } from "context/auth";
import "../styles/global.css";
import { MissionProvider } from "context/authMissions";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <MissionProvider>
          <body>{children}</body>
        </MissionProvider>
      </AuthProvider>
    </html>
  );
}
