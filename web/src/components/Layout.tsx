import React from "react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { NavBar } from "./NavBar";
import { Box, Flex, Heading, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { Footer } from "./Footer";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Box
    bg={'orange.200'}
    color={'orange.300'}>
     
      
    </Box> <Wrapper variant={variant}>{children}</Wrapper>
    <Footer/>
    </>
  );
};
