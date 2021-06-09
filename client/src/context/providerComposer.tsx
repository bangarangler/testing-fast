import React from "react";
import { SubscriptionProvider } from "./allContext";

// @ts-ignore
function ProviderComposer({ contexts, children }) {
  return contexts.reduceRight(
    // @ts-ignore
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids,
      }),
    children
  );
}

//@ts-ignore
function ContextProvider({ children }) {
  return (
    <ProviderComposer contexts={[<SubscriptionProvider />]}>
      {children}
    </ProviderComposer>
  );
}

export { ContextProvider };
