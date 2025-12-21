import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task Manager",
  description: "The app is built by Oleksandr Koniukh"
}

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <body
        className= {`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
        <div className="main">
        </div>
        <main>
          <Nav />
          {children}
        </main>
        </Provider>
        <footer className="fixed bottom-0 left-0 bg-amber-100 w-full text-center py-4 z-40">
          <a href="https://github.com/kolexandr" target="_blank" rel="noopener noreferrer">
            Come to my <b>GitHub</b>
          </a>
          <br />
          <a href="https://www.linkedin.com/in/oleksandr-koniukh-a58158323/" target="_blank" rel="noopener noreferrer">Or to my <b>Linkedln</b></a>
        </footer>
      </body>
    </html>
  );
}

export default RootLayout;