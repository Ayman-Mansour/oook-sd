import { Box, Button, List, Stack, Text, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import path from "path";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useMeQuery,
  useUpdatePostMutation,
  useUserQuery,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/useGetIntId";
import ReactAudioPlayer from "react-audio-player";
import { toErrorMap } from "../../../utils/toErrorMap";
import { toPostErrorMap } from "../../../utils/toPostErrorMap";

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();
  const [{ data: meData }] = useMeQuery();
  const [{data: userData}] = useUserQuery({
    variables:{
      id : meData?.me?.id as number
    }
  })
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  const audio_path = "https://www.ayman-mansour.com/admin/SUD/"

  
  if (meData?.me?.id == null || meData.me.active == "0") {
    return (
      <Layout>
        <Flex height={290}>
          <Text color="Red">Sorry you are not authorized.. </Text>
        </Flex>
      </Layout>
    );
  }

  if (userData?.user[0].role == "Reviewer") {
    return (
      <Layout>
        <Flex height={290}>
          <Text  color="orange">Sorry you are a Reviewer not an Editor.. </Text>
        </Flex>
      </Layout>
    );
  }

  if (data?.post?.updaterId !== 1 && data?.post?.updaterId != meData.me.id ) {
    return (
      <Layout>
        <Flex height={290}>
        <Text color="Red">Sorry you are not authorized.. </Text>
        </Flex>
      </Layout>
    );
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
      <List alignContent="column">
        <Flex p={10} shadow="md" borderWidth="1px">
          <Stack spacing={10}>
            <Formik
              initialValues={{
                id: intId,
                text: data.post.text,
                updaterId: meData?.me?.id as number,
              }}
              onSubmit={async (values, { setErrors }) => {
                const response = await updatePost({ options: values });
                if (response.data?.updatePost.errors) {
                  setErrors(toPostErrorMap(response.data.updatePost.errors));
                  
                }
                 else if (!response.data?.updatePost.errors) {
                  // worked
                  await updatePost({ options: values });
                  router.back();
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="title"
                    placeholder={data?.post?.title}
                    label="Title"
                    disabled
                  />
                  <Box mt={4}>
                    <ReactAudioPlayer
                      src={audio_path + data?.post?.title + ".wav"}
                      title={data?.post?.title}
                      controls
                      loop
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      textarea
                      name="text"
                      placeholder="text..."
                      label="Body"
                      dir={"auto"}
                    />
                  </Box>
                  <Button
                    mt={4}
                    type="submit"
                    isLoading={isSubmitting}
                    variantColor="orange"
                  >
                    update post
                  </Button>
                </Form>
              )}
            </Formik>
          </Stack>
        </Flex>
      </List>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
