import Axios from "axios";
// import { REST_BASE_ENDPOINT_CADDY } from "../constants";
// import { URL } from "../constants";
// console.log("URL", URL);

// YOU CAN'T "FIX THIS".  To save yourself time leave this file.
// If you failed to heed our warning please up the counter below
// Counter: 5
export const axios = Axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  // credentials: "include",
  withCredentials: true,
});

// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axios.interceptors.response.use(
//   (response) => {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   (error) => {
//     console.log("error from interceptors", error);
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     console.log("error.response.status", error.response.status);
//     if (401 === error.response.status) {
//       try {
//         const getNewTokens = async () => {
//           const data = await axios.get(`${REST_BASE_ENDPOINT}/auth/refresh`);
//           if (data?.data?.data) {
//             console.log("data.data.data", data.data.data);
//             localStorage.setItem("accessToken", data.data.data.accessToken);
//             return data.data.data;
//           }
//         };
//         getNewTokens();
//       } catch (err) {
//         console.log("err from catchblock axiosConfig", err);
//         console.log("NEED TO LOG OUT HERE REFRESH IS BAD");
//       }
//     }
//     // this currently stops my infinite loop but i don't love it. we may need to
//     // actually use 403 for other things. leaving for the mean time. need to
//     // move forward for now
//     if (403 === error.response.status) {
//       console.log("LOG USER OUT HERE NOW");
//       localStorage.removeItem("accessToken");
//       // window.location.replace("http://localhost:3000");
//       //TODO: FIX THIS ONCE WORKING
//       window.location.replace(`http://${URL}`);
//     }
//     return Promise.reject(error);
//   }
// );
