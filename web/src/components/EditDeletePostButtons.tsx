import React from "react";
import { Box, IconButton, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery, useUserQuery } from "../generated/graphql";
import { getegid } from "process";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
  updaterId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
  updaterId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();
  // const [{data: userData}] = useUserQuery({
  //   variables:{
  //     id : meData?.me?.id as number
  //   }
  // })
  var url = "";
  if (meData?.me?.id == null) {
    return null;
  }

  // if(updaterId && creatorId == 1 || meData.me.id !== updaterId){

  if (updaterId == 1 || updaterId == meData.me.id) {
    url = "/post/edit/";
    
  }
  // if(meData.me.id == creatorId){
  //   return(
  //     <Box>
  //       <NextLink href={url} as={url+id}>
  //         <IconButton as={Link} mr={4} icon="edit" aria-label="Edit Post" />
  //       </NextLink>
  //       <IconButton
  //         icon="delete"
  //         aria-label="Delete Post"
  //         onClick={() => {
  //           deletePost({ id });
  //         }}
  //       />
  //     </Box>
  //   );
  // }
  else if (meData.me.role === "Reviewer" || meData.me.active === "0"){
    return null
  }
  else {
    url = "/post/";
  }
  return (
    <Box alignSelf={'center'}>
      <NextLink href={url} as={url + id}>
        <IconButton
          as={Link}
          mr={4}
          icon="edit"
          aria-label="Edit Post"
          variantColor="orange"
        />
      </NextLink>
    </Box>
  );
};
