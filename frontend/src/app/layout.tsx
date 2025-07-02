import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/lib/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Новости - Главная",
  description: "Новостной портал",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0, minHeight: "100vh" }}
      >
        <ClientProviders>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#fafafa",
            }}
          >
            <Header />
            <Box component="main" sx={{ flex: 1, p: 2 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
}
