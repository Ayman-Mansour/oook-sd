import React from "react";
import { Box, Heading, IconButton, Link, Text } from "@chakra-ui/core";
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
      <Heading fontSize="xl">
                      Submited posts : {durData?.userdurations[0].count} post/s
                    </Heading>
      <Text>
        Total posts time :{" "}
        {calculateTime(Math.floor(durData?.userdurations[0].sum as number))}
      </Text>
    </Box>
  );
};
