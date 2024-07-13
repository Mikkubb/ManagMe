import ProjectService from '../services/ProjectService';
import { Project } from '../interfaces/Project';
import { checkAuth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  const projectListContainer = document.getElementById('project-list')!;
  const createProjectButton = document.getElementById('create-project')!;

  function renderProjects() {
    const projects = ProjectService.getAll();
    projectListContainer.innerHTML = projects.map(project => 
      `<div class="project-item">
        <div>ID: ${project.id}</div>
        <div>Name: ${project.name}</div>
        <div>Description: ${project.description}</div>
        <div>
          <button class="edit-project btn btn-warning" data-id="${project.id}">Edit</button>
          <button class="delete-project btn btn-danger" data-id="${project.id}">Delete</button>
          <button class="open-project btn btn-success" data-id="${project.id}">Open</button>
        </div>
      </div>`
    ).join('');

    const editButtons = document.querySelectorAll('.edit-project');
    editButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const projectId = (event.target as HTMLElement).dataset.id;
        if (projectId) {
          window.location.href = `edit-project.html?id=${projectId}`;
        } else {
          console.error('Project ID not found.');
        }
      });
    });

    const deleteButtons = document.querySelectorAll('.delete-project');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const projectId = (event.target as HTMLElement).dataset.id;
        if (projectId) {
          ProjectService.delete(projectId);
          renderProjects(); // Zaktualizuj widok po usunięciu projektu
        } else {
          console.error('Project ID not found.');
        }
      });
    });

    const openButtons = document.querySelectorAll('.open-project');
    openButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const projectId = (event.target as HTMLElement).dataset.id;
        if (projectId) {
          ProjectService.setCurrentProject(projectId);
          window.location.href = 'project.html';
        } else {
          console.error('Project ID not found.');
        }
      });
    });
  }

  renderProjects();

  createProjectButton.addEventListener('click', () => {
    const nameInput = document.getElementById('project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('project-description') as HTMLTextAreaElement;
    if (nameInput.value.trim() === '' || descriptionInput.value.trim() === '') {
      alert('Name and description fields must be filled out.');
      return;
    }
    const newProject: Project = { id: '', name: nameInput.value, description: descriptionInput.value };
    ProjectService.create(newProject);
    renderProjects();
    nameInput.value = ''; // Wyczyść pole po dodaniu projektu
    descriptionInput.value = ''; // Wyczyść pole po dodaniu projektu
  });
});
