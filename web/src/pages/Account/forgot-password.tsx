import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { Box, Button, Flex } from "@chakra-ui/core";
import { useForgotPasswordMutation } from "../../generated/graphql";
import { Layout } from "../../components/Layout";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout>
    <Wrapper variant="small">
      <Flex mt={150} mb={150}>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              if an account with that email exists, we will send you an email
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="orange"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
      </Flex>
    </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
