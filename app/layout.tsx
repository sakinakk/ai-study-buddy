import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Study Buddy",
  description: "Organise your time and tasks!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
