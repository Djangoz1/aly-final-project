import { AuthProvider } from "context/auth";
import "../styles/global.css";
import "../styles/star-background.css";

import { AccountProvider } from "context/account";
import { MissionProvider } from "context/hub/mission";
import { CVProvider } from "context/hub/cv";
import { FormProvider } from "context/form";
import { LayoutTools } from "sections/Layout/LayoutTools";
import { ToolsProvider } from "context/tools";

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

      <script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        async
      ></script>
      <script
        src="https://threejs.org/examples/js/libs/stats.min.js"
        async
      ></script>
      <body className="bg-zinc-900 min-h-100vh">
        <AccountProvider>
          <AuthProvider>
            <ToolsProvider>
              <CVProvider>
                <MissionProvider>
                  {/* <div className="bg-animation">
                    <div id="stars"></div>
                    <div id="stars2"></div>
                    <div id="stars3"></div>
                  </div> */}
                  {children}
                </MissionProvider>
              </CVProvider>
            </ToolsProvider>
          </AuthProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
