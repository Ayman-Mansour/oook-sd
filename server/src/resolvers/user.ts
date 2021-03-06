import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
  Int,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";
import { Token } from "../entities/Token";

var passwordHash = require("password-hash");

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    if (req.session.userId === 1) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") _token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 5",
          },
        ],
      };
    }

    const key =  _token;
    // const userId = await redis.get(key);

    const userId = await Token.findOne({ where: { token: key } });


    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = userId.userId;
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await passwordHash.generate(newPassword),
        // password: await argon2.hash(newPassword),
      }
    );

    // await redis.del(key);

    await Token.delete(userId.id);

    // log in user after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string
    // @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();
    let tken;
    try {
      // await Token.create({token: FORGET_PASSWORD_PREFIX + token,
      //   userId: user.id,
      //   experation: "ex",
      //   date:  1000 * 60 * 60 * 24 * 3}).save()
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Token)
        .values({
          token: FORGET_PASSWORD_PREFIX + token,
          userId: user.id,
          experation: "ex",
          date: 1000 * 60 * 60 * 24 * 3,
        })
        .returning("*")
        .execute();
      tken = result.raw[0];
      console.log("Token", tken);
    } catch (err) {

      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err) {
        return {
          errors: [
            {
              field: "Token Error",
              message: "Did not save in db",
            },
          ],
        };
      }
    }
    // await redis.set(
    //   FORGET_PASSWORD_PREFIX + token,
    //   user.id,
    //   "ex",
    //   1000 * 60 * 60 * 24 * 3
    // ); // 3 days

    await sendEmail(
      email,
      `Dear ${user.username} , <br /> Click on the following link to create new password for you oook account:
      <br /> <a href="https://www.oook.sd/Account/change-password/${token}">Reset password</a>
      <br /> Note: This link will be functional for a one time use or 3 days (whichever is earlier)
      <br /> With regards, <br /> OOOK Team.`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  // ----------------------------------------------

  @Query(() => [User])
  async user(@Arg("id", () => Int) id: number) {
    const replacement: any[] = [id];
    const user = await getConnection().query(
      `
    select u.*
    from "user" u 
    ${id ? `where u.id = $1` : ""}`,
      replacement
    );
    // console.log("User : ", user);

    return user;
  }

  // ----------------------------------------------

  @Query(() => [User], { nullable: true })
  async users() {
    const users = await getConnection().query(
      `
    select u.*
    from "user" u where u.id != 1`
    );
    // console.log("Users : ",users);

    return users;
  }

  // ----------------------------------------------
  @Mutation(() => Boolean)
  async activateuser(@Arg("id", () => Int) id: number) {
    await User.update({ id: id }, { active: "1" });

    //     const replacement: any[] = [id]
    //     const user = await getConnection().query(
    //       `
    //     alter u.*
    //     from "user" u
    //     ${id ? `where u.id = $1` : ""} set u.active == 1`,
    //     replacement
    //     );
    // console.log("User : ",user);

    return true;
  }

  @Mutation(() => Boolean)
  async deactivateuser(@Arg("id", () => Int) id: number) {
    await User.update({ id: id }, { active: "0" });

    //     const replacement: any[] = [id]
    //     const user = await getConnection().query(
    //       `
    //     alter u.*
    //     from "user" u
    //     ${id ? `where u.id = $1` : ""} set u.active == 0`,
    //     replacement
    //     );
    // console.log("User : ",user);

    return true;
  }
  // ----------------------------------------------
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await passwordHash.generate(options.password);
    // const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      // User.create({}).save()
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          phone: options.phone,
          email: options.email,
          password: hashedPassword,
          role: options.role,
          active: options.active,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    // const hashedPassword = await passwordHash.generate(password);
    const valid = await passwordHash.verify(password, user.password);

    // console.log("hashed pass : ",hashedPassword);

    // const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
