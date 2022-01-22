import React, { useState } from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, IconButton, Link, List, Stack, Text } from "@chakra-ui/core";
import { useUserPostsQuery, useUserQuery, useUserVotedPostsQuery } from "../generated/graphql";
import { calculateTime } from "../utils/calculateTime";
import { Layout } from "./Layout";
import { UserPostsDurations } from "./UserPostsDurations";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import { UserVotedrPosts } from "./UserVotedPosts";

interface UserPostsprop {
  uid: number;
}

export const UserPosts: React.FC<UserPostsprop> = ({
  uid,
}) => {
  const [variables, setVariables] = useState({
    updaterId: uid,
    limit: 50,
    cursor: null as null | string,
  });
  const [{ data: data, error, fetching  }] = useUserPostsQuery({
    variables: {
      updaterId: uid,
      limit: 15,
    cursor: null as null | string,
    },
  });
  const [{data: userData}] = useUserQuery({
    variables:{
      id : uid
    }
  })
  const [{ data: voteData }] = useUserVotedPostsQuery({
    variables,
  });
  const audio_path = path.join(__dirname, "/files/");
  if (userData?.user[0].role == "Reviewer") {
    return (

        <>
          <Flex
            p={5}
            shadow="md"
            bg={"orange.50"}
            m={5}
            borderRadius={5}
            borderWidth="1px"
          >
            <Box>
              <Heading fontSize="xl">Name : {userData?.user[0].username}</Heading>
              <Heading fontSize="xl">
                Reviewed posts : {voteData?.uservotedposts.votedposts.length}{" "}
                posts
              </Heading>
              {/* <Heading fontSize="xl">
                    <UserPostsDurations updaterId={meData.me.id}/>
                  </Heading> */}
              {/* <Heading fontSize="xl">Name : {meData.me.username}</Heading> */}
            </Box>
          </Flex>
          <Heading fontSize="xl" m={5}>
            Posts
          </Heading>
          {voteData?.uservotedposts.votedposts.map((up) =>
          !up ? null : <UserVotedrPosts postid={up.postId} userid={up.userId} />
        )}
        </>
        

    );
  }else{
    return (
      <Stack>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <List alignContent="column">
            <Stack spacing={8}>
              <>
                <Flex
                  p={5}
                  shadow="md"
                  bg={"orange.50"}
                  m={5}
                  borderRadius={5}
                  borderWidth="1px"
                >
                  <Box>
                    <Heading fontSize="xl">Name : {userData?.user[0].username}</Heading>
                    <Heading fontSize="xl">
                      Submited posts : {data?.userposts.posts.length} post/s
                    </Heading>
                    <Heading fontSize="xl">
                      <UserPostsDurations updaterId={userData?.user[0].id as number}/>
                    </Heading>
                    {/* <Heading fontSize="xl">Name : {meData.me.username}</Heading> */}
                  </Box>
                </Flex>
                <Heading fontSize="xl" m={5}>
                  Posts
                </Heading>
              </>
  
              {data?.userposts.posts.map((p) =>
                !p ? null : (
                  <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                    {/* <UpdootSection post={p} /> */}
                    <Box flex={1}>
                      <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>Posted by: {p.creator.username}</Text>
                      <Flex align="center">
                        <Text flex={1} mt={4} dir={"auto"}>
                          {p.textSnippet}
                        </Text>
                        <ReactAudioPlayer
                          src={audio_path + p.title + ".wav"}
                          controls
                          loop
                        />
                        <Box ml={2}>
                          <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creator.id}
                            updaterId={p.updaterId}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                )
              )}
            </Stack>
          </List>
        )}
        {data && data.userposts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  updaterId: variables.updaterId,
                  limit: variables.limit,
                  cursor:
                    data.userposts.posts[data.userposts.posts.length - 1]
                      .updatedAt,
                });
              }}
              isLoading={fetching}
              m="auto"
              my={8}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Stack>
  
  );}
};
