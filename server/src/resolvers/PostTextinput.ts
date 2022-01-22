import { InputType, Field } from "type-graphql";
@InputType()
export class PostTextinput {
  @Field()
  id: number;
  @Field()
  updaterId: number;
  @Field()
  text: string;
}
