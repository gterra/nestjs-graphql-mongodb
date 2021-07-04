import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field((_type) => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  createdDate: string;
}
