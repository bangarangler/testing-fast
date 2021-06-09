import { GQL_ENDPOINT } from "../constants";
// import { axios } from "./axiosConfig";
import { axios } from "../axiosConfig/axiosConfig";

export function fetcher<TData, TVariables>(
  // requestInit: RequestInit,
  query: string,
  variables?: TVariables
) {
  return async (variables: any): Promise<TData> => {
    try {
      const res = await axios.post(GQL_ENDPOINT, {
        query,
        variables,
        body: JSON.stringify({ query, variables }),
      });

      // console.log("res.data", res?.data);
      if (res?.data?.errors) {
        throw res?.data?.errors[0].message;
      }
      return res?.data?.data;
    } catch (error) {
      throw error;
    }
  };
}
