import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateStudentInput } from './student.input';
import { StudentService } from './student.service';
import { StudentType } from './student.type';

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
