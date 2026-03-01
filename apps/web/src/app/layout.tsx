import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { description, title } from '@/lib/config'
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { CLientProvider } from "@/components/providers/client.provider";
import { getQueryClient } from "@/components/providers/get-query-client";
import { sessionOpt } from "@/modules/auth/hook/rq";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ListExpandProvider } from "@/components/providers/ListExpandProvider";
import { GlobalModalRenderer } from "@/components/uix/modal/provider";
import { SocketIoInitializer } from "@/lib/ws/provider";
import MainUI from "./_comp/MainUI";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: description,
}

export default function RootLayout({
  children,
  modal,
  chat,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode
  chat: React.ReactNode
}>) {
  const qc = getQueryClient()
  qc.prefetchQuery(sessionOpt())
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen h-fit`}>
        <CLientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <TooltipProvider>
                <HydrationBoundary state={dehydrate(qc)}>
                  <SocketIoInitializer />
                  <ListExpandProvider />
                  <GlobalModalRenderer />
                  {modal}
                  <MainUI projectUI={children} chatUI={chat} />
                </HydrationBoundary>
                <Toaster
                  position="top-right"
                  richColors
                  className="bg-transparent pointer-events-auto!"
                  duration={60000}
                // style={{ pointerEvents: "auto" }}
                /></TooltipProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </CLientProvider>
      </body>
    </html>
  );
}
