import React from "react";
import { Box, Link, Flex, Button, Heading, Stack, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { EmailIcon, Icon, InfoIcon } from "@chakra-ui/icons";

interface FooterProps {}
const Logo = (props: any) => {
  return (
    <img
      height="92"
      width="92"
      aria-label="oook icon"
      max-width="min-content"
      src="/oook.svg"
    />
  );
};
export const Footer: React.FC<FooterProps> = ({}) => {
  let body = (
    <Flex
      as={Stack}
      maxW={"6xl"}
      py={20}
      position="sticky"
      direction={{ base: "column", md: "row" }}
      p={4}
      justify={{ base: "center", md: "space-between" }}
      align={{ base: "center", md: "center" }}
    >
      <Stack gridColumn={2} direction="column">
        <NextLink href="/about">
          <Link flexDirection="-moz-initial" position="relative" mr={10}>
            About
          </Link>
        </NextLink>
        <Link href="mailto:support@oook.sd">Report an issue</Link>

        <Text>
          Designed by{" "}: {" "}
          
          <Link
            href="https://www.ayman-mansour.com"
            target="_blank"
            rel="From oook.sd"
          >
            Ayman Mansour
          </Link>
        </Text>
      </Stack>
    </Flex>
  );
  return (
    <Flex
      zIndex={1}
      bottom=""
      position="sticky"
      bg={"orange.200"}
      color={"orange.700"}
      p={4}
    >
      <Flex flex={0.5} m="auto" align="center" maxW={800}>
        {/* <NextLink href="/">
          <Link>
            <Heading  size="sm">OOOK - عووك </Heading>
          </Link>
</NextLink> */}

        <Logo />
        <Box ml={"auto"}>{body}</Box>
        {/* <Text flexDirection="-moz-initial" position="relative" mr={10}>All rights reserved</Text> */}
      </Flex>
    </Flex>
    //     <Box
    //     bg={'orange.200'}
    //     color={'orange.700'}>
    //     <Flex
    //       as={Stack}
    //       maxW={'6xl'}
    //       py={4}
    //       direction={{ base: 'column', md: 'row' }}
    //       p={4}
    //       justify={{ base: 'center', md: 'space-between' }}
    //       align={{ base: 'center', md: 'center' }}>
    //       <Logo />

    //     </Flex>
    //   </Box>
  );
};
