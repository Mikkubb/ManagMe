import ProjectService from '../services/ProjectService';
import { Project } from '../interfaces/Project';
import { checkAuth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    console.error('Project ID not provided.');
    return;
  }

  const project = ProjectService.get(projectId);
  if (!project) {
    console.error('Project not found.');
    return;
  }

  const nameInput = document.getElementById('project-name') as HTMLInputElement;
  const descriptionInput = document.getElementById('project-description') as HTMLTextAreaElement;
  const saveButton = document.getElementById('save-project');

  if (!nameInput || !descriptionInput || !saveButton) {
    console.error('One of the required elements not found.');
    return;
  }

  nameInput.value = project.name;
  descriptionInput.value = project.description;

  saveButton.addEventListener('click', () => {
    const updatedProject: Project = { ...project, name: nameInput.value, description: descriptionInput.value };
    ProjectService.update(updatedProject);
    window.location.href = 'add-project.html'; // Powrót do strony głównej po zapisaniu zmian
  });
});
