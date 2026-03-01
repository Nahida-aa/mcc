import { cn } from "../../lib/utils";
import { Button as UiButton } from "@/components/ui/button";
import type {
  AnchorHTMLAttributes,
  ComponentProps,
  HTMLAttributeAnchorTarget,
  HTMLAttributes,
  JSX,
  ReactNode,
} from "react";
import Link, { type LinkProps } from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { CodeBlock } from "@/components/uix/CodeBlock/client";
import { textDefault } from "@/components/html/css";
import { XTooltip } from "./tooltip";

export const Main = ({
  className = "",
  MagicCardClass = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  MagicCardClass?: string;
}) => (
  <main
    {...props}
    className={cn(
      " min-h-0 rounded-md bg-card text-card-foreground shadow-sm min-w-0 w-full p-4",
      className,
    )}
  >
    {/* <MagicCard
      className={cn("p-3", MagicCardClass)}
      classNames={{
        content: "flex flex-col gap-3 min-h-0",
      }}
    > */}
    {props.children}
    {/* </MagicCard> */}
  </main>
);

export const Text = ({
  className = "",
  size = "sm",
  href,
  noStyleLink = false,
  rel, // noreferrer: 防止跨域攻击
  target, // _blank 时打开新tab页
  startContent,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  href?: string;
  noStyleLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
  startContent?: ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  const content = (
    <span
      {...props}
      className={cn(
        textDefault,
        {
          "text-xl [&_svg]:size-5 font-bold": size === "md",
        },
        "leading-5",
        className,
      )}
    >
      {startContent}
      {startContent ? (
        <span className="leading-none relative top-[0.9px]">{children}</span>
      ) : (
        children
      )}
      {/* <span className="leading-none relative top-[0.9px]">{children}</span> */}
    </span>
  );
  // 条件渲染：优先 Link > NoStyleLink > span
  if (href && !noStyleLink) {
    return (
      <Link href={href as LinkProps["href"]} target={target}>
        {content}
      </Link>
    );
  }
  if (href && noStyleLink) {
    return (
      <NoStyleLink href={href} rel={rel} target={target}>
        {content}
      </NoStyleLink>
    );
  }
  return content;
};

export const TooltipText = ({
  description,
  ...props
}: ComponentProps<typeof Text> & {
  description: JSX.Element | string | number;
}) => {
  return (
    <XTooltip content={description}>
      <Text {...props} />
    </XTooltip>
  );
};

export const Row = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn("flex flex-row flex-wrap gap-2 items-center", className)}
    >
      {props.children}
    </div>
  );
};

export const Pre = ({
  children,
  json = {},
  className,
  ...props
}: HTMLAttributes<HTMLPreElement> & {
  json?: any;
  children?: string;
}) => (
  <CodeBlock code={JSON.stringify(json, null, 2)} language="json" />
  // <pre
  //   {...props}
  //   className={cn(
  //     "wrap-break-word whitespace-pre-wrap break-all min-w-0 w-full text-sm overflow-auto bg-ctp-crust  rounded-md",
  //     className,
  //   )}
  // >
  //   <CodeBlock code={JSON.stringify(json, null, 2)} language="json" />
  //   {json ? JSON.stringify(json, null, 2) : children}
  // </pre>
);

type NoStyleLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    className?: string;
  };

export const NoStyleLink = ({
  children,
  className,
  ...props
}: NoStyleLinkProps) => {
  return (
    <Link
      {...props}
      className={cn(
        "text-inherit no-underline inline-flex items-center",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export interface ButtonProps extends ComponentProps<typeof UiButton> {
  href?: string;
  pending?: boolean;
  Icon?: ReactNode;
  classNames?: {
    href?: string;
  };
}
export const Button = ({
  children,
  className,
  classNames,
  variant,
  href,
  pending,
  disabled,
  size,
  Icon,
  ...props
}: ButtonProps) => {
  variant = href && !variant ? "ghost" : variant;
  const content = (
    <UiButton
      className={cn(
        "appearance-none select-none subpixel-antialiased overflow-hidden  transform-gpu  cursor-pointer   px-4     leading-[1.15]",
        "active:scale-95 transition-transform duration-100", // data-[pressed=true]:scale-[0.97]
        {
          "justify-start": href && variant === "ghost",
          "p-2 ": size === "icon-sm",
        },
        className,
      )}
      variant={variant}
      disabled={pending || disabled}
      size={size}
      {...props}
    >
      {Icon ? (
        <span className={cn("shrink-0", { "animate-spin": pending })}>
          {Icon}
        </span>
      ) : (
        pending && <Spinner />
      )}
      {children}
    </UiButton>
  );

  return href ? (
    <NoStyleLink
      className={cn("flex w-full justify-start", classNames?.href)}
      href={href}
    >
      {content}
    </NoStyleLink>
  ) : (
    content
  );
};
Button.displayName = "Button"; // forwardRef 需要
