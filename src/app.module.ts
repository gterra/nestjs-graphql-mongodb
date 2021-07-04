import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LessonModule } from './lesson/lesson.module';
import { Lesson } from './lesson/lesson.entity';
import { StudentModule } from './student/student.module';
import { Student } from './student/student.entity';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { User } from './auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`config/${process.env.STAGE.trim().toLowerCase()}.env`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'mongodb',
          url: configService.get('DB_URL'),
          useUnifiedTopology: true,
          synchronize: true,
          entities: [Lesson, Student, User],
        };
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    LessonModule,
    StudentModule,
    AuthModule,
  ],
})
export class AppModule {}
