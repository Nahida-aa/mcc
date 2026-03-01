import Image from "next/image";
import type { ComponentProps } from "react";
import { ServerImage } from "./ServerImage";
import { cn } from "@/lib/utils";
import { getDefaultAvatar } from "@/modules/auth/utils/avatar";
import { NoStyleLink } from "@/components/uix/link";

export type OnlineStatus = "online" | "offline" | "idle" | "dnd";

export const StatusAvatar = ({
  href,
  src,
  name,
  size = "default",
  isOnline,
  onlineStatus,
  className,
  rootClassName,
  statusClassName,
  ...props
}: Omit<
  ComponentProps<typeof ServerImage>,
  "alt" | "width" | "height" | "src"
> & {
  href?: string;
  name?: string;
  size?: "default" | "sm" | "lg" | "xl";
  src?: string | null;
  isOnline?: boolean;
  onlineStatus?: OnlineStatus;
  rootClassName?: string;
  statusClassName?: string;
}) => {
  const sizeMap = {
    default: {
      image: 8, // 8*4 = 32px
      status: 2.5, // 2.5*4 = 10px
    },
    sm: {
      image: 6,
      status: 2.5,
    },

    lg: {
      image: 10, // 10*4 = 40px
      status: 4, //
    },
    xl: {
      image: 20, // 20*4 = 80px
      status: 4, //
    },
  };
  const src1 = src || getDefaultAvatar(name || "null", sizeMap[size].image * 4);

  const ret = (
    <span className={cn("flex relative rounded-full", rootClassName)}>
      <ServerImage
        src={src1}
        alt={name || "avatar"}
        width={sizeMap[size].image * 4}
        height={sizeMap[size].image * 4}
        className={cn(
          `rounded-full min-w-${sizeMap[size].image} min-h-${sizeMap[size].image}`,
          className,
        )}
        {...props}
      />
      <span
        data-slot="status-dot"
        className={cn(
          "absolute -bottom-0.5 -right-0.5  border rounded-full",
          "size-fit flex",
          statusClassName,
        )}
      >
        <span
          className={cn(
            "rounded-full flex",
            `size-${sizeMap[size].status}`,
            isOnline ? "bg-green-500" : "bg-gray-500",
            onlineStatus === "online" && "bg-green-500",
            onlineStatus === "offline" && "bg-gray-500",
          )}
        />
      </span>
    </span>
  );

  if (href) {
    return <NoStyleLink href={href}>{ret}</NoStyleLink>;
  }
  return ret;
};

// <div class="wrapper__44b0c avatar__1fed1" role="img" aria-label="nahida_aa, 在线" aria-hidden="false" style="width: 80px; height: 80px;"><svg width="92" height="92" viewBox="0 0 92 92" class="mask__44b0c svg__44b0c" aria-hidden="true"><foreignObject x="0" y="0" width="80" height="80" mask="url(#svg-mask-avatar-status-round-80)"><div class="avatarStack__44b0c"><img alt=" " class="avatar__44b0c" aria-hidden="true" src="https://cdn.discordapp.com/avatars/1317134881553256532/fc78bd344774335f43a5d6758d537557.webp?size=160"></div></foreignObject><g><rect width="16" height="16" x="60" y="60" fill="#45a366" mask="url(#svg-mask-status-online)" class="pointerEvents__44b0c"></rect></g></svg></div>
