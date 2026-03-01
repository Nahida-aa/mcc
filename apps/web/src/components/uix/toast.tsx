// https://sonner.emilkowal.ski/
import { toast as sonnerToast, type ExternalToast } from "sonner";
import { User } from "./user";
import type { JSXElementConstructor, ReactElement } from "react";
import { Pre } from "@/components/uix/html";
// import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, XIcon } from "lucide-react";
import { analyzeError, ErrorJson, translateMessage } from "@/lib/http/utils";
import { Alert } from "@/components/uix/alert";
import { Button } from "@/components/ui/button";
const any2str = (value: any): string => {
  if (value == null) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Unserializable Object]";
    }
  }
  return String(value);
};

export const toastError = (error: unknown, title?: string) => {
  console.log(error);
  let description: object | undefined | null | JSON;

  if (error instanceof Error) {
    console.log(error.cause);
    // const eerJson = analyzeError(error);
    description = {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      status: "status" in error ? error.status : undefined,
    };
    title = title ?? (error.message || `${error.name} ${error.cause}`);
  } else if (typeof error === "object" && error !== null) {
    const errObj = error as {
      name?: string;
      message?: string;
      cause?: string;
    };
    errObj.message = errObj?.message
      ? translateMessage(errObj?.message)
      : undefined;
    title = title ?? (errObj?.message || `${errObj?.name} ${errObj?.cause}`);
    description = error;
  } else {
    // description = error;
  }
  console.log({
    title,
    description,
  });
  // sonnerToast.error(title, { description });
  sonnerToast.custom((t) => (
    <div className="bg-popover flex flex-col gap-2 rounded-md border p-4 w-89">
      <Alert variant="destructive">{title}</Alert>
      {description && <Pre json={description} />}

      <Button
        size="icon-sm"
        variant="ghost"
        className="absolute top-1 right-1"
        onClick={() => sonnerToast.dismiss(t)}
      >
        <XIcon />
      </Button>
    </div>
  ));
};
export const toastMsg = (
  name: string,
  avatar?: string | null,
  description?: string,
) =>
  sonnerToast.custom(
    (t) => (
      <div className="bg-ctp-surface0/60 rounded-md p-2 w-80">
        <User src={avatar} name={name} size="sm" description={description} />
      </div>
    ),
    {
      position: "top-center",
    },
  );
// export const toast = {
//   success: (title?: string, description?: any) =>
//     sonnerToast.success(title, { description: any2str(description) }),
//   error: toastError,
//   warning: (title?: string, description?: any) =>
//     sonnerToast.warning(title, {
//       description: any2str(description),
//     }),
//   info: (title?: string, description?: any) =>
//     sonnerToast.info(title, {
//       description: any2str(description),
//     }),
//   promise: sonnerToast.promise,
//   custom: (
//     jsx: (
//       id: string | number,
//     ) => ReactElement<unknown, string | JSXElementConstructor<any>>,
//     data?: ExternalToast,
//   ) => sonnerToast.custom(jsx, data),
//   msg: (name: string, avatar?: string | null, description?: string) =>
//     sonnerToast.custom(
//       (t) => (
//         <div className="bg-ctp-surface0/60 rounded-md p-2 w-80">
//           <User src={avatar} name={name} size="sm" description={description} />
//         </div>
//       ),
//       {
//         position: "top-center",
//       },
//     ),
// };
// sonnerToast.loading
