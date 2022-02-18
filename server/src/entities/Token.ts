import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Token extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  token: string;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column()
  experation: string;

  @Field()
  @Column()
  date: number;
}
