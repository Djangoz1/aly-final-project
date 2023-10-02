import { AuthProvider } from "context/auth";
import "../styles/global.css";
import "../styles/star-background.css";

import { AccountProvider } from "context/account";
import { MissionProvider } from "context/hub/mission";
import { CVProvider } from "context/hub/cv";
import { FormProvider } from "context/form";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap"
          rel="stylesheet"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@900&display=swap"
          rel="stylesheet"
        ></link>

        <link
          href="https://fonts.googleapis.com/css2?family=Exo:wght@200;500;700;800&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="page">
        <AccountProvider>
          <AuthProvider>
            <CVProvider>
              <MissionProvider>{children}</MissionProvider>
            </CVProvider>
          </AuthProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
