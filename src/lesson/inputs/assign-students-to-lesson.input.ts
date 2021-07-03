import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignStudentsToLessonInput {
  @IsUUID()
  @Field((_type) => ID)
  lessonId: string;

  @IsUUID('4', { each: true })
  @Field((_type) => [ID])
  studentIds: string[];
}
