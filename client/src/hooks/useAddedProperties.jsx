import React from "react";
import { useQuery } from "react-query";
import { getAddedProperties } from "../utils/api";
import { useAuth0 } from "@auth0/auth0-react";

const UseAddedProperties = () => {
  const { user } = useAuth0();
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: "addedProperties",
    queryFn: () => getAddedProperties(user?.email),
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default UseAddedProperties;
