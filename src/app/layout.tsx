
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";


// Import debug utilities in development
if (process.env.NODE_ENV === 'development') {
  import('@/utils/debug-auth');
}

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
