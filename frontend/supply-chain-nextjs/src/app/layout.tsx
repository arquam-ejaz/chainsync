import React from "react";
import { ContextProvider } from "@/providers/ContextProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <ContextProvider>{children}</ContextProvider>
        </div>
      </body>
    </html>
  );
}
