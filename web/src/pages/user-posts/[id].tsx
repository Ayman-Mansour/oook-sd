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
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { UpdootSection } from "../../components/UpdootSection";
import {
  useMeQuery,
  usePostsQuery,
  useUserDurationsQuery,
  useUserPostsQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import ReactAudioPlayer from "react-audio-player";
import path from "path";
import { UserPostsDurations } from "../../components/UserPostsDurations";
import { useGetUserFromUrl } from "../../utils/useGetUserFromUrl";
import { UserPosts } from "../../components/UserPosts";

const UserPostsDetails = () => {
  const [{ data: udata}] = useGetUserFromUrl();
  const [{ data: meData }] = useMeQuery();

  const [variables, setVariables] = useState({
    updaterId: meData?.me?.id as number,
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = useUserPostsQuery({
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
  if (meData?.me?.id == null) {
    return (
      <Layout>
        <Flex height={290}>
          <Text color="Red">Sorry you are not authorized.. </Text>
        </Flex>
      </Layout>
    );
  }
  
  if (!udata?.user) {
    return (
      <Layout>
        <Box>could not find user</Box>
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
  const audio_path = "https://www.ayman-mansour.com/admin/SUD/"
  // console.log('audio path: ', audio_path)

  return (
    <Layout>
    {udata?.user.map((u) =>
                !u ? null : (
    <UserPosts uid = {u.id}/>))} 
     </Layout>

  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(UserPostsDetails);
