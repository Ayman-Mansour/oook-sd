import React from "react";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
} from "@chakra-ui/core";
import { useUsersDurationsQuery } from "../generated/graphql";
import { calculateTime } from "../utils/calculateTime";

export const AllUsersPostsDurations = () => {
  const [{ data: durData }] = useUsersDurationsQuery();
  var usersduration = durData?.usersdurations[0].sum as number;
  var allpostsduration = 172042 as number;
  var percentage = (usersduration / allpostsduration) * 100;
  return (
    <Flex dir="column" m={2} align={"center"} position={"sticky"}>
      
      <Box>
        <Text fontSize="xl" fontWeight="bold" flex={1}>
          Submited posts :{" "}{calculateTime(durData?.usersdurations[0].sum as number)}
        </Text>
        
        <Text fontSize="xl" fontWeight="bold" flex={1}>
          Total of all Posts {" "} :{" "} {calculateTime(allpostsduration as number)}
        </Text>
      </Box>
      <CircularProgress ml={{base:400, md:100}} value={Math.floor(percentage)} color="orange">
        <CircularProgressLabel fontSize={14}>
          {Math.floor(percentage)}%
        </CircularProgressLabel>
      </CircularProgress>
    </Flex>
  );
};
