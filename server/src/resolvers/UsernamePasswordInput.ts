import { InputType, Field } from "type-graphql";
@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  phone: string;
  @Field()
  password: string;
  @Field()
  role: string;
  @Field()
  active: string;
}
