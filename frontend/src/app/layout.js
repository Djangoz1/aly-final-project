import { AuthProvider } from "context/auth";
import "../styles/global.css";
import "../styles/star-background.css";

import { AccountProvider } from "context/account";

import { ToolsProvider } from "context/tools";
import { Header } from "sections/Layout/Header";

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

      <body className=" min-h-screen dark overflow-y-scroll pt-20 relative overflow-x-hidden bg-[#121312] box-border">
        <AccountProvider>
          <AuthProvider>
            <ToolsProvider>
              <main className=" w-screen   min-h-[92vh] box-border flex flex-col z-1 relative">
                {children}
              </main>

              <Header
                style={
                  "bg-white/5 backdrop-blur-xl fixed top-0 left-0 w-screen h-[9vh] "
                }
              />
            </ToolsProvider>
          </AuthProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
