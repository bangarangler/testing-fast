import { useEffect } from "react";
import { useGetUserQuery } from "../../codeGenFE";
import { useSubscriptionContext } from "../../context/allContext";

const Me = () => {
  // @ts-ignore
  const { count, setCount } = useSubscriptionContext();
  const { data, error } = useGetUserQuery(
    { email: "hank@hank.com" },
    {
      onSuccess: () => {
        // console.log("onSuccess");
        // setCount(count + 1);
      },
    }
  );

  useEffect(() => {
    console.log("HERE:: count", count);
  }, [count]);
  console.log("data fro mme", data);
  console.log("err from me", error);
  return <div>Check console for data</div>;
};

export default Me;
