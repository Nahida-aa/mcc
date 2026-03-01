import { ReactNode } from "react";
import { Providers } from "../prefetching/providers";

export default function Layout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>
}