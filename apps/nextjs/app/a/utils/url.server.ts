"use server";

import { headers } from "next/headers";

export const actGetAppUrl = async () => {
  // "use cache";
  const header = await headers();
  return header.get("origin");
};
