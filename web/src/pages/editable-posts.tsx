import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, {
  JSXElementConstructor,
  ReactElement,
  ReactNodeArray,
  ReactPortal,
  useState,
} from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useEditablePostsQuery,
  useMeQuery,
  useUserDurationsQuery,
  useUsersQuery,
  useVottablePostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import { calculateTime } from "../utils/calculateTime";
import { UserPostsDurations } from "../components/UserPostsDurations";

const EditablePosts = () => {
  const [variables, setVariables] = useState({
    // updaterId: 1,
    limit: 20,
    cursor: null as null | string,
  });
  const [_variable, setVariable] = useState({
    updaterId: 1,
  });
  const [{ data: usersData }] = useUsersQuery();
  const [{ data: meData }] = useMeQuery();
  const [{ data, error, fetching }] = useEditablePostsQuery({
    variables,
  });
  const [{ data: voteData, error: voteerror, fetching: votefetching }] =
    useVottablePostsQuery({
      variables,
    });
  const [{ data: durData }] = useUserDurationsQuery({});
  const [, activateUser] = useActivateUserMutation();
  const [, deActivateUser] = useDeactivateUserMutation();

  var uid;
  const audio_path = "https://www.ayman-mansour.com/admin/SUD/"
  // console.log('audio path: ', audio_path)

  if (!fetching && !data) {
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

  if (meData?.me?.id == 1) {
    return (
      <Layout>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <SimpleGrid columns={1} spacing={5} flexWrap="wrap">
            {usersData?.users?.map((u) => {
              return !u ? null : (
                <Flex key={u.id} p={5} shadow="md" borderWidth="1px">
                  {/* {setVariable({updaterId: 2 })} */}
                  <Box flexWrap="inherit">
                    <NextLink
                      href="/user-posts/[id]"
                      as={`/user-posts/${u.id}`}
                    >
                      <Link>
                        <Heading fontSize="xl">Username : {u.username}</Heading>
                      </Link>
                    </NextLink>
                    <Heading fontSize="xl">
                      <UserPostsDurations updaterId={u.id} />
                    </Heading>
                    <Heading fontSize="xl">
                      <Text>Email : {u.email}</Text>
                      <Text>Role : {u.role}</Text>
                      <Text>Active : {u.active}</Text>
                      <Box dir="row">
                        <IconButton
                          m={2}
                          icon="unlock"
                          aria-label="Activate User"
                          onClick={() => {

                            activateUser({ id: u.id });
                          }}
                        />
                        <IconButton
                          m={2}
                          icon="not-allowed"
                          aria-label="Deactivate User"
                          onClick={() => {
                            deActivateUser({ id: u.id });
                          }}
                        />
                      </Box>
                    </Heading>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
      </Layout>
    );
  }

  if (meData.me.role == "Reviewer") {
    return (
      <Layout>
        {!voteData && votefetching ? (
          <div>loading...</div>
        ) : (
          <SimpleGrid columns={1} spacing={5} flexWrap="wrap">
            {voteData?.votableposts.posts.map((vp) => {
              return !vp ? null : (
                <Flex key={vp.id} p={5} shadow="md" borderWidth="1px">
                  
                  <UpdootSection
                    post={vp}
                    updaterid={vp.updaterId}
                    direction="column"
                    disabled={true}
                  />
                  <Box flexWrap="inherit">
                    <NextLink href="/post?uri=[id]" as={`/post/${vp.id}`}>
                      <Link>
                        <Heading fontSize="xl">{vp.title}</Heading>
                      </Link>
                    </NextLink>

                    <Text>Posted by: {vp.creator.username}</Text>
                    <Box m={2}>
                      <Text flex={1} mt={4}>
                        {vp.textSnippet}
                      </Text>
                      <Flex dir="column">
                        <ReactAudioPlayer
                          src={audio_path + vp.title + ".wav"}
                          controls
                          title= {vp.title}
                          preload="metadata"
                        />
                        {/* {async () => {
          if (p.updaterId == p.creator.id) { */}

                        {/* <EditDeletePostButtons
                        id={vp.id}
                        creatorId={vp.creator.id}
                        updaterId={vp.updaterId}
                      /> */}
                      </Flex>
                      {/* }
          
        }} */}
                    </Box>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
        {voteData && voteData.votableposts.hasMore ? (
          <Flex alignItems="center">
            <Button
              onClick={() => {
                setVariables({
                  // creatorId: null,
                  limit: variables.limit,
                  cursor:
                    voteData.votableposts.posts[
                      voteData.votableposts.posts.length - 1
                    ].createdAt,
                });
              }}
              isLoading={votefetching}
              m="auto"
              my={8}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    );
  } else {
    return (
      <Layout>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <SimpleGrid columns={1} spacing={5} flexWrap="wrap">
            {data?.editableposts.posts.map((p) => {
              return !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <Box flexWrap="inherit">
                    <NextLink href="/post?uri=[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>

                    <Text>Posted by: {p.creator.username}</Text>
                    <Box m={2}>
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      <Flex dir="column">
                        <ReactAudioPlayer
                          src={audio_path + p.title + ".wav"}
                          controls
                          title={p.title}
                          preload="metadata"
                        />
                        {/* {async () => {
          if (p.updaterId == p.creator.id) { */}
                        <Flex ml={2}>
                          <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creator.id}
                            updaterId={p.updaterId}
                          />
                        </Flex>
                      </Flex>
                      {/* }
          
        }} */}
                    </Box>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
        {data && data.editableposts.hasMore ? (
          <Flex alignItems="center">
            <Button
              onClick={() => {
                setVariables({
                  // creatorId: null,
                  limit: variables.limit,
                  cursor:
                    data.editableposts.posts[
                      data.editableposts.posts.length - 1
                    ].createdAt,
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

export default withUrqlClient(createUrqlClient, { ssr: true })(EditablePosts);
