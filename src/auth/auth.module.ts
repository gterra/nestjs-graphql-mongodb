import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt-strategy';
import { GqlAuthGuard } from './gql-auth.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN_SECONDS'),
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard],
  exports: [JwtStrategy, PassportModule, GqlAuthGuard],
})
export class AuthModule {}
