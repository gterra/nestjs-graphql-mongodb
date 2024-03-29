import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { StudentType } from 'src/student/student.type';
import { StudentService } from '../student/student.service';
import { AssignStudentsToLessonInput } from './inputs/assign-students-to-lesson.input';
import { FilterInput } from './inputs/filter.input';
import { CreateLessonInput } from './inputs/lesson.input';
import { Lesson } from './lesson.entity';
import { LessonService } from './lesson.service';
import { LessonType } from './lesson.type';

@UseGuards(GqlAuthGuard)
@Resolver((_of) => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}

  @Query((_returns) => [LessonType])
  lessons(@Args('filterInput', { defaultValue: {} }) filterInput: FilterInput) {
    return this.lessonService.getLessons(filterInput);
  }

  @Query((_returns) => LessonType)
  lesson(@Args('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @Mutation((_returns) => LessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation((_returns) => LessonType)
  assignStudentsToLesson(
    @Args('assignStudentsToLesson')
    assignStudentsToLesson: AssignStudentsToLessonInput,
  ) {
    return this.lessonService.assignStudentsToLesson(assignStudentsToLesson);
  }

  @ResolveField((_returns) => [StudentType])
  async students(@Parent() lesson: Lesson) {
    return this.studentService.getManyStudents(lesson.students);
  }
}
