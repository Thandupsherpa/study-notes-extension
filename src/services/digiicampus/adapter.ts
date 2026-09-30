import { Semester, Course, Module, ModuleContent, DigiicampusSessionStatus } from '../../types';

export interface DigiicampusAdapter {
  detectSession(): Promise<DigiicampusSessionStatus>;
  getSemesters(): Promise<Semester[]>;
  getCurrentSemester(): Promise<Semester | null>;
  getCourses(semesterId: string): Promise<Course[]>;
  getModules(courseId: string): Promise<Module[]>;
  getModuleContent(courseId: string, moduleId: string): Promise<ModuleContent>;
}
