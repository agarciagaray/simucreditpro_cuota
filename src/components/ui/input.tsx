import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[0.25rem] border border-[#e2e5ef] bg-white px-4 py-2 text-base font-normal text-skote-dark placeholder:text-skote-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skote-primary focus-visible:border-skote-primary focus-visible:ring-offset-2 transition disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
