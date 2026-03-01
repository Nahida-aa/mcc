import { string } from "zod";
import { cn } from "../../lib/utils";
import { StatusAvatar } from "./StatusAvatar";

export const User = ({
  src,
  name,
  size = "md",
  avatarSize,
  classNames,
  ...props
}: {
  src?: string | null;
  classNames?: {
    base?: string;
    avatar?: string;
    content?: string;
    name?: string;
    description?: string;
  };
  name?: React.ReactNode;
  size?: "lg" | "md" | "sm";
  avatarSize?: number;
  description?: React.ReactNode;
}) => (
  <div className={cn("flex items-center gap-2", classNames?.base)}>
    <div className={cn("flex h-full py-px items-center justify-center")}>
      <StatusAvatar
        src={src}
        name={name instanceof string ? String(name) : undefined}
        // size={avatarSize}
        className={cn(
          {
            "size-14": size === "lg",
            "size-10": size === "md",
            "size-8": size === "sm",
          },
          classNames?.avatar,
        )}
      />
    </div>
    <div
      className={cn(
        "",
        {
          "h-14": size === "lg",
          "h-10": size === "md",
          "h-8.5": size === "sm",
        },
        classNames?.content,
      )}
    >
      <div
        className={cn(
          "text-base leading-5 text-start font-medium",
          classNames?.name,
        )}
      >
        {name}
      </div>
      <div
        className={cn(
          " text-xs text-muted-foreground -mt-0.5 ",
          classNames?.description,
        )}
      >
        {props.description}
      </div>
    </div>
  </div>
);
