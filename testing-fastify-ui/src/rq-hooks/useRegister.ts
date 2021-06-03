import { REST_BASE_ENDPOINT } from "../constants";
import { useMutation } from "react-query";
// import axios from "axios";
import { axios } from "../axiosConfig/axiosConfig";

interface RegisterInput {
  email: string;
  password: string;
}

export function useRegister(options: any) {
  console.log("running useRegister");

  return useMutation(async (registerInput: RegisterInput) => {
    try {
      const { data } = await axios.post(
        `${REST_BASE_ENDPOINT}/register`,
        registerInput
      );
      console.log("data from useRegister", data);
      if (data.data) {
        return data.data;
      }
    } catch (err) {
      console.log("err from useRegister", err.response.data);
      throw new Error(err.response.data.message);
    }
  }, options);
}
