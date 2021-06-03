import { useState } from "react";
import { useRegister } from "../../rq-hooks";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate } = useRegister({
    onSuccess: (data: any) => {
      console.log("data from login", data);
    },
    onError: (err: any) => {
      console.log("err from login", err);
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ email, password });
      }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
