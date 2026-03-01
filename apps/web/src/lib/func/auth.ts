import { getSession } from "@/modules/auth/action";

export const withAuth =
  <Args extends unknown[], R>(
    fn: (userId: string, ...args: Args) => R | Promise<R>,
  ) =>
  async (...args: Args) => {
    const session = await getSession();
    console.log("session:", session);
    if (!session) throw new Error("NoAuth");
    const userId = session.user.id;
    return await fn(userId, ...args);
  };
