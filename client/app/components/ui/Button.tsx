import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 视觉风格 */
  variant?: "primary" | "ghost" | "link";
  /** 尺寸 */
  size?: "md" | "sm";
  /** 是否 loading：会禁用并显示菊花 */
  loading?: boolean;
  /** 角色受限：会禁用并显示锁图标 */
  forbidden?: boolean;
  /** forbidden 时的 title 文案 */
  titleWhenForbidden?: string;
  /** 在按钮文字前放一个自定义图标 */
  leadingIcon?: React.ReactNode;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "relative inline-flex items-center justify-center border rounded transition " +
  "focus:outline-none focus:ring-2 disabled:focus:ring-0 " +
  "disabled:cursor-not-allowed disabled:opacity-70 disabled:grayscale";

const variants = {
  primary:
    "text-white bg-black border-black hover:bg-red-600 active:translate-y-px focus:ring-black " +
    "disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-300",
  ghost:
    "text-black bg-white border-gray-300 hover:bg-gray-50 active:translate-y-px focus:ring-gray-400 " +
    "disabled:text-gray-400 disabled:border-gray-200",
  link:
    "border-0 p-0 h-auto text-blue-600 underline hover:opacity-80 focus:ring-blue-600 " +
    "disabled:text-gray-400",
} as const;

const sizes = {
  md: "px-3 py-2 text-sm",
  sm: "px-2 py-1 text-xs",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      forbidden = false,
      titleWhenForbidden,
      leadingIcon,
      children,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading || forbidden;

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        title={forbidden && titleWhenForbidden ? titleWhenForbidden : rest.title}
        {...rest}
      >
        {/* 锁图标（受限） */}
        {forbidden && (
          <span aria-hidden className="mr-2">🔒</span>
        )}

        {/* 自定义前置图标 */}
        {!forbidden && leadingIcon ? (
          <span className="mr-2" aria-hidden>{leadingIcon}</span>
        ) : null}

        {/* loading 菊花 */}
        {loading && (
          <svg
            className={cn("animate-spin h-4 w-4 mr-2", variant === "link" && "text-current")}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
        )}

        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
