import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@src/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  function getInitials(name: string): string {
    if (!name) return "";

    // Split the name by spaces and get first and last parts
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      // If only one word, take up to first two characters
      return parts[0].substring(0, 2).toUpperCase();
    } else {
      // Otherwise take first character of first and last parts
      const firstInitial = parts[0].charAt(0);
      const lastInitial = parts[parts.length - 1].charAt(0);
      return (firstInitial + lastInitial).toUpperCase();
    }
  }

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? getInitials(children) : children}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
