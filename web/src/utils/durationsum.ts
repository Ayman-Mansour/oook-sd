import { PostQuery, PostsQuery } from "../generated/graphql";

export const Durations = (duration: PostQuery[]) => {
    const durationMap: [] = [];
    duration.forEach(({ post }) => {
      durationMap[post?.id as number] ;
    });
  
    return durationMap;
  };