import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './inputs/lesson.input';
import { AssignStudentsToLessonInput } from './inputs/assign-students-to-lesson.input';
import { FilterInput } from './inputs/filter.input';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(filterInput: FilterInput): Promise<Lesson[]> {
    const { name, startDate } = filterInput;
    let query = {};
    if (name) {
      query = { name: { $regex: new RegExp(name) } };
    }
    if (startDate) {
      const startInterval = new Date(startDate);
      const endInterval = new Date(startDate);
      endInterval.setDate(endInterval.getDate() + 1);
      query = {
        ...query,
        startDate: {
          $gte: startInterval.toISOString(),
          $lt: endInterval.toISOString(),
        },
      };
    }
    return this.lessonRepository.find({ where: query });
  }

  async getLessonById(id: string): Promise<Lesson> {
    const found = await this.lessonRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });

    return this.lessonRepository.save(lesson);
  }

  async assignStudentsToLesson(
    assingStudentsToLessonInput: AssignStudentsToLessonInput,
  ): Promise<Lesson> {
    const { lessonId, studentIds } = assingStudentsToLessonInput;
    const lesson = await this.lessonRepository.findOne({ id: lessonId });
    lesson.students = [
      ...(lesson.students ? lesson.students : []),
      ...studentIds,
    ];
    return this.lessonRepository.save(lesson);
  }
}
