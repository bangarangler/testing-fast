import { SubscriptionClient } from "graphql-subscriptions-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
// import { GQL_SUBSCRIPTION_ENDPOINT } from "../../../constants";
import { GQL_SUBSCRIPTION_ENDPOINT } from "../../constants";
// import { useUserContext } from "../allContexts";

// @ts-ignore
export const SubscriptionContext = createContext();

export function SubscriptionProvider(props: any) {
  const [count, setCount] = useState(0);
  const qClient = useQueryClient();
  // const { user } = useUserContext();

  useEffect(() => {
    console.log("subscription context running");
    if (count) {
      const query = `
        subscription sayHey {
              sayHey
          }
      `;

      const client = new SubscriptionClient(GQL_SUBSCRIPTION_ENDPOINT, {
        reconnect: true,
        lazy: true, // only connect when there is a query
        connectionCallback: (error) => {
          error && console.error(error);
          return;
        },
      });

      const subscription = client.request({ query }).subscribe({
        next({ data }: any) {
          if (data) {
            console.log("data from subscription", data);
            // qClient.invalidateQueries("getUserNotes");
          }
          return;
        },
      });

      return () => subscription.unsubscribe();
    }
    return;
    // }, [user]);
  }, [count]);

  return (
    <SubscriptionContext.Provider value={{ count, setCount }}>
      {props.children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptionContext = () => {
  return useContext(SubscriptionContext);
};
