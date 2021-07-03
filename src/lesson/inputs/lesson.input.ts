import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsDateString } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @MinLength(1)
  @Field()
  name: string;

  @IsDateString()
  @Field()
  startDate: string;

  @IsDateString()
  @Field()
  endDate: string;

  @Field((_type) => [ID], { defaultValue: [] })
  students: string[];
}
