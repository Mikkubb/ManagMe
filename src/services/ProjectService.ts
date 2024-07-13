import { Project } from '../interfaces/Project';
import StoryService from './StoryService';

class ProjectService {
  private storageKey = 'projects';
  private currentProjectKey = 'currentProject';
  private lastProjectIdKey = 'lastProjectId'; // Klucz do przechowywania globalnego licznika identyfikatorów projektów

  getAll(): Project[] {
    const projects = localStorage.getItem(this.storageKey);
    return projects ? JSON.parse(projects) : [];
  }

  get(id: string): Project | undefined {
    const projects = this.getAll();
    return projects.find(project => project.id === id);
  }

  getById(id: string): Project | undefined {  // Alias dla metody get
    return this.get(id);
  }

  getNextId(): number {
    let lastId = parseInt(localStorage.getItem(this.lastProjectIdKey) || '0', 10);
    const nextId = lastId + 1;
    localStorage.setItem(this.lastProjectIdKey, nextId.toString());
    return nextId;
  }

  create(project: Project): void {
    const projects = this.getAll();
    project.id = this.getNextId().toString(); // Ustawianie nowego unikalnego ID projektu
    projects.push(project);
    this.save(projects);
  }

  update(updatedProject: Project): void {
    const projects = this.getAll();
    const projectIndex = projects.findIndex(project => project.id === updatedProject.id);
    if (projectIndex !== -1) {
      projects[projectIndex] = updatedProject;
      this.save(projects);
    }
  }

  delete(id: string): void {
    let projects = this.getAll();
    projects = projects.filter(project => project.id !== id);
    this.save(projects);
    StoryService.deleteStoriesByProject(id); // Usuwanie historii powiązanych z projektem
  }

  setCurrentProject(id: string): void {
    localStorage.setItem(this.currentProjectKey, id);
  }

  getCurrentProject(): Project | null {
    const currentProjectId = localStorage.getItem(this.currentProjectKey);
    return currentProjectId ? this.get(currentProjectId) || null : null;
  }

  private save(projects: Project[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }
}

export default new ProjectService();
