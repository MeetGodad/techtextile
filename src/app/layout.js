import { Inter } from "next/font/google";
import { AuthContextProvider } from "./auth/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthContextProvider>
        {children}
        </AuthContextProvider>
        </body>
    </html>
  );
}
