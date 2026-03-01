"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation";

export default function Page() {
  return (
    <main className="min-w-0">
      <h2>左剩余, 右自动按照内容宽度</h2>
      <section className="grid grid-cols-[1fr_auto] gap-2 bg-card min-w-0 w-full">
        <div className="min-w-0 bg-red-950">
          <span className="truncate block ">1234567890123456789012345678901</span>
        </div>
        <div className="bg-green-950">
          <span>1234567890123456789012345678901</span>
        </div>
      </section>
      <p>This is the Page page.</p>
    </main>
  );
}
