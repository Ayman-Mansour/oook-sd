import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Float,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { PostTextinput } from "./PostTextinput";
import { validatePostUpdate } from "../utils/validatePostUpdate";

@ObjectType()
class PostFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [PostFieldError], { nullable: true })
  errors?: PostFieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}


@ObjectType()
class Sum {
  @Field(() => Float)
    sum:number;
  
}

@ObjectType()
class VotedPosts {
  @Field(() => [Updoot])
  votedposts: Updoot[];
  @Field()
  hasMore: boolean;
  
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.updaterId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const updoot = await updootLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });

    return updoot ? updoot.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const updoot = await Updoot.findOne({ where: { postId, userId } });

    // the user has voted on the post before
    // and they are changing their vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    update updoot
    set value = $1
    where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!updoot) {
      // has never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    insert into updoot ("userId", "postId", value)
    values ($1, $2, $3)
        `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
    update post
    set points = points + $1
    where id = $2
      `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."updatedAt" < $2` : ""}
    order by p."updatedAt" DESC
    limit $1
    `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();
    // console.log("posts: ", posts);

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === reaLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }
  
  // @Query(() => [Post], { nullable: true })
  // user_posts(@Arg("creatorId", () => Int) creatorId: number): Promise<Post[] | undefined> {
  //   return Post.find(Post);
  // }

// ------------------------------------------------------

@Query(() => PaginatedPosts)
async userposts(
  // @Arg("creatorId", () => Int) creatorId: number,
  @Arg("updaterId", () => Int) updaterId: number,
  @Arg("limit", () => Int) limit: number,
  @Arg("cursor", () => String, { nullable: true }) cursor: string | null
): Promise<PaginatedPosts> {
  // 20 -> 21
  const updaterid = updaterId
  const realLimit = Math.min(50, limit);
  const reaLimitPlusOne = realLimit + 1;

  const replacements: any[] = [updaterid, reaLimitPlusOne];

  if (cursor) {
    replacements.push(new Date(parseInt(cursor)));
  }

  const posts = await getConnection().query(
    `
  select p.*
  from post p
  ${updaterId ? `where p."updaterId" = $1` : ""}
  ${cursor ? `and p."updatedAt" < $3` : ""}
  order by p."updatedAt" DESC
  limit $2
  `,
    replacements
    
  );
console.log("query prams", replacements)
  // const qb = getConnection()
  //   .getRepository(Post)
  //   .createQueryBuilder("p")
  //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
  //   .orderBy('p."createdAt"', "DESC")
  //   .take(reaLimitPlusOne);

  // if (cursor) {
  //   qb.where('p."createdAt" < :cursor', {
  //     cursor: new Date(parseInt(cursor)),
  //   });
  // }

  // const posts = await qb.getMany();
  // console.log("posts: ", posts);

  return {
    posts: posts.slice(0, realLimit),
    hasMore: posts.length === reaLimitPlusOne,
  };
}
// ------------------------------------------------------

@Query(() => VotedPosts)
async uservotedposts(
  // @Arg("creatorId", () => Int) creatorId: number,
  @Arg("updaterId", () => Int) updaterId: number,
  @Arg("limit", () => Int) limit: number,
  @Arg("cursor", () => String, { nullable: true }) cursor: string | null
): Promise<VotedPosts> {
  // 20 -> 21
  const updaterid = updaterId
  const realLimit = Math.min(50, limit);
  const reaLimitPlusOne = realLimit + 1;

  const replacements: any[] = [updaterid, reaLimitPlusOne];

  if (cursor) {
    replacements.push(new Date(parseInt(cursor)));
  }
const up = await Updoot.find(({ where: { userId: updaterid }}));
  // const voted_posts = await getConnection().query(
  //   `
  // select p.*
  // from updoot p
  // where p."userId" = ${updaterId }`
    
  // );
console.log("returned val", up)
 

  return {
    votedposts: up,
    hasMore: up.length === reaLimitPlusOne,
  };
}

// ------------------------------------------------------

@Query(() => PaginatedPosts)
async editableposts(
  // @Arg("creatorId", () => Int) creatorId: number,
  @Arg("limit", () => Int) limit: number,
  @Arg("cursor", () => String, { nullable: true }) cursor: string | null
): Promise<PaginatedPosts> {
  // 20 -> 21
  const creatorid = 1;
  const realLimit = Math.min(50, limit);
  const reaLimitPlusOne = realLimit + 1;

  const replacements: any[] = [creatorid, reaLimitPlusOne];

  if (cursor) {
    replacements.push(new Date(parseInt(cursor)));
  }

  const posts = await getConnection().query(
    `
  select p.*
  from post p
  ${creatorid ? `where p."updaterId" = $1` : ""}
  ${cursor ? `and p."createdAt" < $3` : ""}
  order by p."createdAt" DESC
  limit $2
  `,
    replacements
  );

  return {
    posts: posts.slice(0, realLimit),
    hasMore: posts.length === reaLimitPlusOne,
  };
}
// ------------------------------------------------------

@Query(() => PaginatedPosts)
async votableposts(
  // @Arg("creatorId", () => Int) creatorId: number,
  @Arg("limit", () => Int) limit: number,
  @Arg("cursor", () => String, { nullable: true }) cursor: string | null
): Promise<PaginatedPosts> {
  // 20 -> 21
  const creatorid = 1;
  // const points = 0;
  const realLimit = Math.min(50, limit);
  const reaLimitPlusOne = realLimit + 1;

  const replacements: any[] = [creatorid, reaLimitPlusOne];

  if (cursor) {
    replacements.push(new Date(parseInt(cursor)));
  }

  const posts = await getConnection().query(
    `
  select p.*
  from post p
  ${creatorid ? `where p."updaterId" != $1` : ""}
  ${cursor ? `and p."updatedAt" < $3` : ""}
  order by p."createdAt" DESC
  limit $2
  `,
    replacements
  );

  return {
    posts: posts.slice(0, realLimit),
    hasMore: posts.length === reaLimitPlusOne,
  };
}

// ------------------------------------------------------
 
@Query(() => [Sum])
async usersdurations(
  // @Arg("creatorId", () => Int) creatorId: number,
  // @Arg("limit", () => Int) limit: number,
  // @Arg("cursor", () => String, { nullable: true }) cursor: string | null
){
  // 20 -> 21
  // const creatorid = 1;
  // const realLimit = Math.min(50, limit);
  // const reaLimitPlusOne = realLimit + 1;

  // const replacements: any[] = [creatorid, reaLimitPlusOne];

  // if (cursor) {
  //   replacements.push(new Date(parseInt(cursor)));
  // }

  const durations = await getConnection().query(
    `
  select SUM(p.duration)
  from post p where p."updaterId" != 1`
  );
// console.log("dura", durations[0]);

  return durations
}

// ------------------------------------------------------

@Query(() => [Sum])
async userdurations(
  @Arg("updaterId", () => Int) updaterId: number,
  // @Arg("limit", () => Int) limit: number,
  // @Arg("cursor", () => String, { nullable: true }) cursor: string | null
){
  // 20 -> 21
  // const creatorid = 1;
  // const realLimit = Math.min(50, limit);
  // const reaLimitPlusOne = realLimit + 1;

  // const replacements: any[] = [creatorid, reaLimitPlusOne];

  // if (cursor) {
  //   replacements.push(new Date(parseInt(cursor)));
  // }
  // const replacements: any[] = [updaterId]
  const durations = await getConnection().query(
    `
  select SUM(p.duration)
  from post p 
   where p."updaterId" = ${updaterId }`
  // ,
  //   replacements
  );
console.log("dura", durations[0]);

  return durations
}

// ------------------------------------------------------
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async updatePost(
    // @Arg("id", () => Int) id: number,
    // @Arg("text") text: string,
    // @Arg("updaterId", () => Int) updaterId: number,
    @Arg("options") options: PostTextinput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse | null> {
    const errors = validatePostUpdate(options);
    if (errors) {
      return { errors };
    }
    const id = options.id;
    const text = options.text;
    const updaterId = options.updaterId;
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ text, updaterId })
      .where('id = :id ', {
        id,
        updaterId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (post.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
