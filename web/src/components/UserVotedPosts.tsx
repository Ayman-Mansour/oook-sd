import React, { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  List,
  Stack,
  Text,
} from "@chakra-ui/core";
import {
  PostSnippetFragment,
  usePostQuery,
  useUserPostsQuery,
  useUserQuery,
} from "../generated/graphql";
import { calculateTime } from "../utils/calculateTime";
import { Layout } from "./Layout";
import { UserPostsDurations } from "./UserPostsDurations";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import { UpdootSection } from "./UpdootSection";

interface UserVotedPostsprop {
  postid: number;
  userid: number;
}

export const UserVotedrPosts: React.FC<UserVotedPostsprop> = ({
  postid,
  userid,
}) => {
  const [variables, setVariables] = useState({
    id: postid,
    limit: 50,
    cursor: null as null | string,
  });
  const [{ data: data, error, fetching }] = usePostQuery({
    variables: {
      id: postid,
      //   limit: 15,
      // cursor: null as null | string,
    },
  });
  // const [{data: userData}] = useUserQuery({
  //   variables:{
  //     id : userid
  //   }
  // })
  const audio_path = path.join(__dirname, "/files/");

  return (
    <Stack>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <List alignContent="column">
          <Stack spacing={8}>
            {/* {data?.post.map((p) => */}
            {/* !p ? null : ( */}
            <Flex key={data?.post?.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection
                post={data?.post as PostSnippetFragment}
                updaterid={data?.post?.updaterId as number}
                direction="column"
                disabled={true}
              />
              <Box flex={1}>
                <NextLink href="/post?uri=[id]" as={`/post/${data?.post?.id}`}>
                  <Link>
                    <Heading fontSize="xl">{data?.post?.title}</Heading>
                  </Link>
                </NextLink>
                <Text>Posted by: {data?.post?.creator.username}</Text>
                <Flex align="center">
                  <Text flex={1} m={4} dir={"auto"}>
                    {data?.post?.textSnippet}
                  </Text>
                  <ReactAudioPlayer
                    src={audio_path + data?.post?.title + ".wav"}
                    controls
                    
                  />
                  <Box ml={2}>
                    {/* <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creator.id}
                            updaterId={p.updaterId}
                          /> */}
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Stack>
        </List>
      )}
    </Stack>
  );
};
