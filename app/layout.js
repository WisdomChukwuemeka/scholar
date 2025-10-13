import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jornivo",
  description: "Publish your journal, article, books from the comfort of your home.",
  email: "wisdomchukwuemeka97@gmail.com",
  contact: "+234906907221"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`container mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <Header />
        <div className="min-h-screen pb-5">
        {children}
        </div>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
