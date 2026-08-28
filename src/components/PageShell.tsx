import type { ReactNode } from "react";
import DrawerCart from "@/sections/cart-drawer/DrawerCart";

/**
 * Cart drawer shared by inner pages. Header and footer live in src/app/layout.tsx.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DrawerCart />
      {children}
    </>
  );
}
