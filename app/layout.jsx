import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import Link from 'next/link';

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

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#faf8f3] min-h-screen flex flex-col`}>
        <Provider>
          <div className="flex flex-1 min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col items-center py-10 px-4 min-h-screen shadow-sm">
              {/* Profile Image */}
              <div className="mb-10 flex flex-col items-center">
                <Link href="/" className="w-full">
                  <img
                  src="/navigation.png"
                  alt="Profile"
                  className="w-20 h-20 rounded-full border border-gray-200 shadow-sm mb-4 object-cover"
                  />
                </Link>
              </div>
              {/* Navigation Buttons */}
              <Nav />
              <div className="flex-1" />
              {/* Footer in sidebar for minimalism */}
              <footer className="w-full text-center text-xs text-gray-400 pb-2 mt-10">
                <a href="https://github.com/kolexandr" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                <span className="mx-2">·</span>
                <a href="https://www.linkedin.com/in/oleksandr-koniukh-a58158323/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
              </footer>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-start px-8 py-10 bg-[#faf8f3] min-h-screen">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;