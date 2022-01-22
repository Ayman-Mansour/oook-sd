import { utimes } from "fs";
import { useRouter } from "next/router";
import {  useUserQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetUserFromUrl = () => {
  const intId = useGetIntId();
  return useUserQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
