import { REST_BASE_ENDPOINT } from "../constants";
import { useMutation } from "react-query";
// import axios from "axios";
import { axios } from "../axiosConfig/axiosConfig";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin(options: any) {
  console.log("running useLogin");

  return useMutation(async (loginInput: LoginInput) => {
    try {
      const { data } = await axios.post(
        `${REST_BASE_ENDPOINT}/login`,
        loginInput
      );
      console.log("data from useLogin", data);
      if (data.data) {
        return data.data;
      }
    } catch (err) {
      console.log("err from useLogin", err.response.data);
      throw new Error(err.response.data.message);
    }
  }, options);
}
