import React from "react";
import { Box, IconButton, Link, Text } from "@chakra-ui/core";
import { useUserDurationsQuery } from "../generated/graphql";
import { calculateTime } from "../utils/calculateTime";

interface UserPostsDurationsprop {
  updaterId: number;
}

export const UserPostsDurations: React.FC<UserPostsDurationsprop> = ({
  updaterId,
}) => {
  const [{ data: durData }] = useUserDurationsQuery({
    variables: {
      updaterId: updaterId,
    },
  });
  return (
    <Box>
      <Text>
        Total posts time :{" "}
        {calculateTime(Math.floor(durData?.userdurations[0].sum as number))}
      </Text>
    </Box>
  );
};
