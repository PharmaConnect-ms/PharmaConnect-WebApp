
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata = {
  title: "PharmaConnect",
  description: "Digital platform for pharmacy management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
