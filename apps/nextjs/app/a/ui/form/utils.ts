"use client";
import { useState } from "react";

export function handleSubmit<T extends Record<string, any>>(
  onSubmit: (data: T) => Promise<void> | void,
) {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as T;
    await onSubmit(data);
  };
}
export const useSubmit = () => {
  const [pending, setPending] = useState(false);
  return {
    handleSubmit: <R>(onSubmit: (fd: FormData) => Promise<R> | R) => {
      return async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);

        try {
          const formData = new FormData(e.target as HTMLFormElement);
          return await onSubmit(formData);
        } finally {
          setPending(false);
        }
      };
    },
    pending,
  };
};
