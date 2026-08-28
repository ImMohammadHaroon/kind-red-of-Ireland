import content from "@/data/content";

import Header from "@/sections/header/Header";
import DrawerCart from "@/sections/cart-drawer/DrawerCart";
import Hero from "@/sections/hero/Hero";
import Mission from "@/sections/mission/Mission";
import ProductTabs from "@/sections/product-tabs/ProductTabs";
import Craftsmanship from "@/sections/craftsmanship/Craftsmanship";
import Menswear from "@/sections/menswear/Menswear";
import Bridal from "@/sections/bridal/Bridal";
import Focus from "@/sections/focus/Focus";
import LatestNews from "@/sections/latest-news/LatestNews";
import Instagram from "@/sections/instagram/Instagram";
import Footer from "@/sections/footer/Footer";

/** Section order matches the original homepage template. */
export default function HomePage() {
  return (
    <div id="main">
      <Header />
      <DrawerCart />

      <main>
        <Hero />
        <Mission />
        <ProductTabs />
        <Craftsmanship items={content.craftsmanshipTop} />
        <Menswear />
        <Bridal />
        <Focus />
        <Craftsmanship items={content.craftsmanshipBottom} />
        <LatestNews />
        <Instagram />
      </main>

      <Footer />
    </div>
  );
}
