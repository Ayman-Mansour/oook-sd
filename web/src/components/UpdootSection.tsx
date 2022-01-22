import React, { useState } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/core";
import {
  PostSnippetFragment,
  useMeQuery,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
  updaterid: number
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post, updaterid }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  const [{ data: meData }] = useMeQuery();

  if (meData?.me?.id == null || updaterid == 1) {
    return null;
  }

  if (meData?.me?.role === "admin" || meData?.me?.role === "Reviewer") {
    return (
      <Flex dir="row" justifyContent="center" alignItems="center" mr={4}>
        <IconButton
          m={2}
          onClick={async () => {
            if (post.voteStatus === 1) {
              return;
            }
            setLoadingState("updoot-loading");
            await vote({
              postId: post.id,
              value: 1,
            });
            setLoadingState("not-loading");
          }}
          variantColor={post.voteStatus === 1 ? "green" : undefined}
          isLoading={loadingState === "updoot-loading"}
          aria-label="updoot post"
          icon="check"
        />
        {post.points}
        <IconButton
          m={2}
          onClick={async () => {
            if (post.voteStatus === -1) {
              return;
            }
            setLoadingState("downdoot-loading");
            await vote({
              postId: post.id,
              value: -1,
            });
            setLoadingState("not-loading");
          }}
          variantColor={post.voteStatus === -1 ? "red" : undefined}
          isLoading={loadingState === "downdoot-loading"}
          aria-label="downdoot post"
          icon="small-close"
        />
      </Flex>
    );
  } else {
    return null;
  }
  // return (
  //   <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
  //     <IconButton
  //       onClick={async () => {
  //         if (post.voteStatus === 1) {
  //           return;
  //         }
  //         setLoadingState("updoot-loading");
  //         await vote({
  //           postId: post.id,
  //           value: 1,
  //         });
  //         setLoadingState("not-loading");
  //       }}
  //       variantColor={post.voteStatus === 1 ? "green" : undefined}
  //       isLoading={loadingState === "updoot-loading"}
  //       aria-label="updoot post"
  //       icon="chevron-up"
  //     />
  //     {post.points}
  //     <IconButton
  //       onClick={async () => {
  //         if (post.voteStatus === -1) {
  //           return;
  //         }
  //         setLoadingState("downdoot-loading");
  //         await vote({
  //           postId: post.id,
  //           value: -1,
  //         });
  //         setLoadingState("not-loading");
  //       }}
  //       variantColor={post.voteStatus === -1 ? "red" : undefined}
  //       isLoading={loadingState === "downdoot-loading"}
  //       aria-label="downdoot post"
  //       icon="chevron-down"
  //     />
  //   </Flex>
  // );
};
