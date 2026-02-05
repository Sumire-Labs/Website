import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: "primary" | "glass";
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
    external?: boolean;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "", ...rest } = props;

  const baseClass = variant === "primary" ? "btn-primary" : "btn-glass";
  const combinedClass = `${baseClass} inline-flex items-center justify-center gap-2 ${className}`;

  if ("href" in rest && rest.href) {
    const { href, external, ...linkProps } = rest as ButtonAsLink;

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClass}
          {...linkProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClass} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
