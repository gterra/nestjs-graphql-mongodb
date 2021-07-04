import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsOptional } from 'class-validator';

@InputType()
export class FilterInput {
  @IsOptional()
  @Field({ nullable: true })
  name: string;

  @IsDateString()
  @IsOptional()
  @Field({ nullable: true })
  startDate: string;
}
