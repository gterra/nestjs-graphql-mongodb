import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CreateStudentInput } from './student.input';
import { StudentService } from './student.service';
import { StudentType } from './student.type';

@UseGuards(GqlAuthGuard)
@Resolver((_of) => StudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query((_returns) => [StudentType])
  students() {
    return this.studentService.getStudents();
  }

  @Query((_returns) => StudentType)
  student(@Args('id') id: string) {
    return this.studentService.getStudentById(id);
  }

  @Mutation((_returns) => StudentType)
  createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return this.studentService.createStudent(createStudentInput);
  }
}
