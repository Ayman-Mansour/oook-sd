import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  List,
  Flex,
  Stack,
  RadioGroup,
  Radio,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/core";
import { Wrapper } from "../../components/Wrapper";
import { InputField } from "../../components/InputField";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components/Layout";

// import { createStandaloneToast } from '@chakra-ui/react'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();


// const toast = createStandaloneToast()
// // const customToast = createStandaloneToast({ theme: yourCustomTheme })

// toast({
//   title: 'An error occurred.',
//   description: 'Unable to create user account.',
//   status: 'error',
//   duration: 9000,
//   isClosable: true,
// })

  return (
    <Layout>
      <Wrapper variant="small">
        <List alignContent="column">
          <Flex p={10} shadow="md" borderWidth="1px">
            <Stack spacing={10}>
              <Formik
                initialValues={{
                  email: "",
                  username: "",
                  phone: "",
                  password: "",
                  role: "",
                  active: '1',
                }}
                onSubmit={async (values, { setErrors }) => {
                  const response = await register({ options: values });
                  if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                  } else if (response.data?.register.user) {
                    // worked
                    router.push("/");
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <InputField
                      name="username"
                      placeholder="username"
                      label="Username"
                    />
                    <Box mt={4}>
                      {/* <InputGroup>
                        <InputLeftAddon children="+249" />
                        <Input
                          type="tel"
                          placeholder="phone number"
                          name="phone"
                          pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                        />
                      </InputGroup> */}
                      <InputField
                        label="phone"
                        type="tel"
                        placeholder="phone number"
                        name="phone"
                        //  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                      />
                    </Box>

                    <Box mt={4}>
                      <InputField
                        name="email"
                        placeholder="email"
                        label="Email"
                      />
                    </Box>
                    <Box mt={4}>
                      {/* {function PasswordInput() {
                        const [show, setShow] = React.useState(false);
                        const handleClick = () => setShow(!show);

                        return (
                          <InputGroup size="md">
                            <Input
                              name="password"
                              pr="4.5rem"
                              type={show ? "text" : "password"}
                              placeholder="Enter password"
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                onClick={handleClick}
                              >
                                {show ? "Hide" : "Show"}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        );
                      }} */}
                      <InputField
                        name="password"
                        placeholder="password"
                        label="Password"
                        type="password"
                      />
                    </Box>
                    
                      {/* <RadioGroup name="role" defaultValue='0'>
                        <Radio value='0'>Editor</Radio>
                        <Radio value='1'>Reviewer</Radio>
                    </RadioGroup> */}
                      {/* <div id="my-radio-group">Picked</div> */}
                      <Flex role="group"  alignContent='center' aria-labelledby="my-radio-group">
                      <Box m={4}>
                      <Tooltip aria-label='' hasArrow label='Listening and edit posts' bg='orange.100' color='black'>
                        <label>
                          <Field type="radio" name="role" value="Editor" />
                         <br/>Editor
                        </label>
                        </Tooltip>
                        </Box>
                        <Box m={4}>
                        <Tooltip aria-label='' hasArrow label='Evaluate edited posts' bg='orange.100' color='black'>
                        <label>
                          <Field type="radio" name="role" value="Reviewer" />
                          <br/>Reviewer
                        </label>
                        </Tooltip>
                        </Box>
                      </Flex>
                    <Button
                      mt={4}
                      type="submit"
                      isLoading={isSubmitting}
                      variantColor="orange"
                    >
                      register
                    </Button>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Flex>
        </List>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
