import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Grid,
  List,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import {
  useMeQuery,
  usePostsQuery,
  useUserDurationsQuery,
  useUserPostsQuery,
  useUserVotedPostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import { UserPostsDurations } from "../components/UserPostsDurations";
import { UserVotedrPosts } from "../components/UserVotedPosts";

const Posts = () => {
  const [{ data: meData }] = useMeQuery();

  const [variables, setVariables] = useState({
    updaterId: meData?.me?.id as number,
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = useUserPostsQuery({
    variables,
  });
  const [{ data: voteData }] = useUserVotedPostsQuery({
    variables,
  });
  if (!fetching && !data && !meData) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }
  if (meData?.me?.id == null || meData.me.active == "0") {
    return (
      <Layout>
        <Flex height={290}>
          <Text color="Red">Sorry you are not authorized.. </Text>
        </Flex>
      </Layout>
    );
  }
  // const playAudio = async (id) => {
  //   try {
  //     const response = await withUrqlClient.get(`api/getaudio/id/${id}`)
  //     const mp3 = new Blob([response.data], { type: 'audio/mp3' })
  //     const url = window.URL.createObjectURL(mp3)
  //     const audio = new Audio(url)
  //     audio.load()
  //     await audio.play()
  //   } catch (e) {
  //     console.log('play audio error: ', e)
  //   }
  // }
  // return (
  //   <ul>
  //     {props.topList.map(item => (
  //       <li onClick={() => playAudio(item.id)}>{item.title}</li>
  //     ))}
  //   </ul>
  // )
  const audio_path = path.join(__dirname, "/files/");
  // console.log('audio path: ', audio_path)
  if (meData.me.role == "Reviewer") {
    return (
      <Layout>
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
              <Heading fontSize="xl">Name : {meData.me.username}</Heading>
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
        </>
        {voteData?.uservotedposts.votedposts.map((up) =>
          !up ? null : <UserVotedrPosts postid={up.postId} userid={up.userId} />
        )}
      </Layout>
    );
  } else {
    return (
      <Layout>
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
                    <Heading fontSize="xl">Name : {meData.me.username}</Heading>
                    <Heading fontSize="xl">
                      Submited posts : {data?.userposts.posts.length} post/s
                    </Heading>
                    <Heading fontSize="xl">
                      <UserPostsDurations updaterId={meData.me.id} />
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
                    <Box flex={1} alignSelf="center">
                      <NextLink href="/post?uri=[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>Posted by: Me 😎</Text>
                      <UpdootSection post={p} updaterid={p.updaterId} />

                      <Text flex={1} mt={4} dir={"auto"}>
                        {p.textSnippet}
                      </Text>
                      <Flex m={2} align="center">
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
                  updaterId: meData?.me?.id as number,
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
      </Layout>
    );
  }
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Posts);
