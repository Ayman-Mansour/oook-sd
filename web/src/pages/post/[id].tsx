import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components/Layout";
import { Heading, Box, Text, Flex, Stack, List, Textarea } from "@chakra-ui/core";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import { Wrapper } from "../../components/Wrapper";
import { useMeQuery } from "../../generated/graphql";
import { UpdootSection } from "../../components/UpdootSection";
const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();
  const [{ data: meData }] = useMeQuery();
  const audio_path = "https://www.ayman-mansour.com/admin/SUD/"
  // console.log('audio path: ', audio_path)
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Flex p={10} shadow="md" borderWidth="1px">
        <Stack spacing={10}>
          <Heading fontSize="xl" mb={4}>{data.post.title}</Heading>
          <Box p={2}  dir='column'>
          <Text>Posted by : {data.post.creator.username}</Text>{" "}
          <Text>Post Evaluation = {data.post.points}</Text>
          </Box>
          <Box mb={4} dir={"auto"}>
            <Text> {data.post.text}</Text>
            </Box>
          <Stack p={5} direction="column">
            <ReactAudioPlayer
              src={audio_path + data.post.title + ".wav"}
              title={data.post.title}
              controls
            />
            <Flex p={2} alignSelf="center" direction={'column'}>
              <EditDeletePostButtons
                id={data.post.id}
                creatorId={data.post.creator.id}
                updaterId={data.post.updaterId}
              />          <UpdootSection  post={data.post} updaterid={data.post.updaterId} />

            </Flex>
          </Stack>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
