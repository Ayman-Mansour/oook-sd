import React, { useState } from "react";
import { NextPage } from "next";
import { Wrapper } from "../../../components/Wrapper";
import { Formik, Form } from "formik";
import { toErrorMap } from "../../../utils/toErrorMap";
import { InputField } from "../../../components/InputField";
import { Box, Button, Link, Flex } from "@chakra-ui/core";
import { useChangePasswordMutation } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../../../components/Layout";

const ChangePassword: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Layout>
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} style={{ color: "red" }}>
                  {tokenError}
                </Box>
                <NextLink href="/Account/forgot-password">
                  <Link>{" "} great a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="orange"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
