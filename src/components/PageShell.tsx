import type { ReactNode } from "react";
import Header from "@/sections/header/Header";
import DrawerCart from "@/sections/cart-drawer/DrawerCart";
import Footer from "@/sections/footer/Footer";

/**
 * Chrome shared by every page other than the homepage, which composes the
 * sections itself. Keeps the header, cart drawer and footer identical.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div id="main">
      <Header />
      <DrawerCart />
      <main className="inner-page">{children}</main>
      <Footer />
    </div>
  );
}
