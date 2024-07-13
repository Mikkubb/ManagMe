import ProjectService from '../services/ProjectService';
import StoryService from '../services/StoryService';
import { Story } from '../interfaces/Story';
import { checkAuth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  const projectNameElement = document.getElementById('project-name')!;
  const projectDescriptionElement = document.getElementById('project-description')!;
  const todoListElement = document.getElementById('todo-list')!;
  const doingListElement = document.getElementById('doing-list')!;
  const doneListElement = document.getElementById('done-list')!;
  const addStoryButton = document.getElementById('add-story')! as HTMLButtonElement;

  const currentProject = ProjectService.getCurrentProject();

  if (currentProject) {
    projectNameElement.textContent = currentProject.name;
    projectDescriptionElement.textContent = currentProject.description;
  } else {
    projectNameElement.textContent = 'No project selected';
    projectDescriptionElement.textContent = '';
  }

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-GB', options);
  }

  function renderStories() {
    const stories = StoryService.getAll().filter(story => story.projectId === currentProject?.id);
    todoListElement.innerHTML = '';
    doingListElement.innerHTML = '';
    doneListElement.innerHTML = '';

    stories.forEach(story => {
      const storyHTML = `
        <div class="story-item">
          <div>ID: ${story.id}</div>
          <div>Name: ${story.name}</div>
          <div>Description: ${story.description}</div>
          <div>Priority: ${story.priority}</div>
          <div>Status: ${story.status}</div>
          <div>Created At: ${formatDate(story.createdAt)}</div>
          <div>
            <button class="edit-story btn btn-warning" data-id="${story.id}">Edit</button>
            <button class="delete-story btn btn-danger" data-id="${story.id}">Delete</button>
            <button class="open-story btn btn-success" data-id="${story.id}">Open</button>
          </div>
        </div>
      `;

      if (story.status === 'todo') {
        todoListElement.innerHTML += storyHTML;
      } else if (story.status === 'doing') {
        doingListElement.innerHTML += storyHTML;
      } else if (story.status === 'done') {
        doneListElement.innerHTML += storyHTML;
      }
    });

    const deleteButtons = document.querySelectorAll('.delete-story');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const storyId = (event.target as HTMLElement).dataset.id;
        if (storyId) {
          StoryService.delete(storyId);
          renderStories();
        } else {
          console.error('Story ID not found.');
        }
      });
    });

    const openButtons = document.querySelectorAll('.open-story');
    openButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const storyId = (event.target as HTMLElement).dataset.id;
        if (storyId) {
          window.location.href = `tasks.html?storyId=${storyId}`; // Przekierowanie do strony tasks.html z przekazaniem identyfikatora historii
        } else {
          console.error('Story ID not found.');
        }
      });
    });

    const editButtons = document.querySelectorAll('.edit-story');
    editButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const storyId = (event.target as HTMLElement).dataset.id;
        if (storyId) {
          window.location.href = `edit-story.html?id=${storyId}`;
        } else {
          console.error('Story ID not found.');
        }
      });
    });
  }

  renderStories();

  addStoryButton.addEventListener('click', () => {
    if (currentProject) {
      const storyNameInput = document.getElementById('story-name') as HTMLInputElement;
      const storyDescriptionInput = document.getElementById('story-description') as HTMLTextAreaElement;
      const storyPrioritySelect = document.getElementById('story-priority') as HTMLSelectElement;
      const storyStatusSelect = document.getElementById('story-status') as HTMLSelectElement;

      if (storyNameInput.value.trim() === '' || storyDescriptionInput.value.trim() === '') {
        alert('Name and description fields must be filled out.');
        return;
      }

      const newStory: Story = {
        id: '', // Identyfikator zostanie wygenerowany automatycznie przez StoryService
        name: storyNameInput.value.trim(),
        description: storyDescriptionInput.value.trim(),
        priority: storyPrioritySelect.value as 'low' | 'medium' | 'high',
        projectId: currentProject.id,
        createdAt: new Date(),
        status: storyStatusSelect.value as 'todo' | 'doing' | 'done'
      };

      StoryService.create(newStory, currentProject.id); // Przekazujemy ID aktualnego projektu
      renderStories();
      storyNameInput.value = '';
      storyDescriptionInput.value = '';
      storyPrioritySelect.value = 'low';
      storyStatusSelect.value = 'todo';
    } else {
      console.error('No project selected.');
    }
  });

  // Obsługa usuwania projektu
  const deleteProjectButton = document.getElementById('delete-project') as HTMLButtonElement;
  if (deleteProjectButton) {
    deleteProjectButton.addEventListener('click', async () => {
      if (currentProject) {
        // Usunięcie projektu i powiązanych z nim historii
        await ProjectService.delete(currentProject.id);
        renderStories(); // Odświeżenie listy historii
        projectNameElement.textContent = 'No project selected';
        projectDescriptionElement.textContent = '';
      } else {
        console.error('No project selected.');
      }
    });
  }
});
