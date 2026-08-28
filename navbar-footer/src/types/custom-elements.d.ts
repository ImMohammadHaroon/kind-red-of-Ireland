import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * Custom elements defined by the original theme scripts. They carry no props of
 * their own - the scripts read everything out of the DOM inside them.
 */
type CustomElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** Defined in drawer-cart.js */
      "drawer-cart": CustomElement;
      /** Defined in predictive-search.js */
      "predictive-search": CustomElement;
      /** Defined in localization.js */
      "localization-form": CustomElement;
    }
  }
}
