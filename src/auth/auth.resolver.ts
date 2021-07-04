import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './get-user.decorator';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthCredentialsInput } from './inputs/auth-credentials.input';
import { User } from './user.entity';
import { UserType } from './types/user.type';

@Resolver((_of) => UserType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((_returns) => Boolean, { nullable: true })
  signUp(@Args('authCredentials') authCredentials: AuthCredentialsInput) {
    return this.authService.signUp(authCredentials);
  }

  @Query((_returns) => String)
  signIn(@Args('authCredentials') authCredentials: AuthCredentialsInput) {
    return this.authService.signIn(authCredentials);
  }

  @Query((_returns) => UserType)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.authService.findById(user.id);
  }
}
