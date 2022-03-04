import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNodeArray,
  ReactPortal,
  useState,
} from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery, useUsersDurationsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import posts from "./posts";
import { UserPostsDurations } from "../components/UserPostsDurations";
import { AllUsersPostsDurations } from "../components/AllUsersPostsDurations";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  const audio_path = "https://www.ayman-mansour.com/admin/SUD/"

  if (!fetching && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout >
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <>
          <>
            <Flex
              p={5}
              shadow="md"
              bg={"orange.50"}
              m={5}
              borderRadius={5}
              borderWidth="1px"
            >
              <AllUsersPostsDurations />

            </Flex>
          </>
          <SimpleGrid columns={1} spacing={5} flexWrap="wrap">
            {data!.posts.posts.map((p) => {
              return !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  {/* <UpdootSection post={p} /> */}
                  <Box flexWrap="inherit">
                    <NextLink href="/post?uri=[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>

                    <Text>Posted by: {p.creator.username}</Text>
                    <Box m={2}>
                      <Text flex={1} mt={4} dir={"auto"}>
                        {p.textSnippet}
                      </Text>
                      <Flex dir="column" m={2}>
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
        </>
      )}
      {data && data.posts.hasMore ? (
        <Flex alignItems="center">
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
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
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
