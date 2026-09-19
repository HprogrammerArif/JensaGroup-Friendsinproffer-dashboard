import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const authentication = createApi({
  reducerPath: "authentication",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true")
      return headers;
    },
  }),
  tagTypes: ["User", "Agency", "TourPlan"],
  endpoints: (builder) => ({

     logIn: builder.mutation({
      query: (loginData) => ({
        url: "accounts/login/",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["User"], 
    }),

    verification: builder.mutation({
      query: (emailData) => ({
        url: "otp/verify-otp/",
        method: "PATCH",
        body: emailData,
      }),
      invalidatesTags: ["User"],
    }),
   
    setnewpassword: builder.mutation({
      query: (setnewpassword) => ({
        url: "otp/forgot-password/",
        method: "POST",
        body: setnewpassword,
      }),
      invalidatesTags: ["User"],
    }),

    forgetPassword: builder.mutation({
      query: (forgetPassword) => ({
        url: "otp/send-otp/",
        method: "POST",
        body: forgetPassword,
      }),
      invalidatesTags: ["User"],
    }),

   

  }),
});

export const {
  useLogInMutation,
  useVerificationMutation,
  useForgetPasswordMutation,
  useSetnewpasswordMutation,
} = authentication;