import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

@InputType()
export class AuthCredentialsInput {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Field()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  @Field()
  password: string;
}
