import "./globals.css";
import Provider from "./providers";
import Navbar from './components/(public)/Navbar'
import Footer from './components/(public)/Footer'


export const metadata = {
    title: "Susan Adhikari | MERN & Next.js Developer",
    description: "Full-stack web developer specializing in MERN stack and Next.js. Building fast, scalable, and modern web applications with React, Node.js, Express, and MongoDB.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Provider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}
