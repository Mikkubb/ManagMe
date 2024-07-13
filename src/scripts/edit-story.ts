import StoryService from '../services/StoryService';
import { Story } from '../interfaces/Story';
import { checkAuth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('id');

  if (!storyId) {
    console.error('Story ID not provided.');
    return;
  }

  const story = StoryService.getById(storyId);
  if (!story) {
    console.error('Story not found.');
    return;
  }

  const projectId = story.projectId;

  const nameInput = document.getElementById('story-name') as HTMLInputElement;
  const descriptionInput = document.getElementById('story-description') as HTMLTextAreaElement;
  const prioritySelect = document.getElementById('story-priority') as HTMLSelectElement;
  const statusSelect = document.getElementById('story-status') as HTMLSelectElement;
  const saveButton = document.getElementById('save-story');

  if (!nameInput || !descriptionInput || !prioritySelect || !statusSelect || !saveButton) {
    console.error('One of the required elements not found.');
    return;
  }

  nameInput.value = story.name;
  descriptionInput.value = story.description;
  prioritySelect.value = story.priority;
  statusSelect.value = story.status;

  saveButton.addEventListener('click', () => {
    const updatedStory: Story = {
      ...story,
      name: nameInput.value,
      description: descriptionInput.value,
      priority: prioritySelect.value as 'low' | 'medium' | 'high',
      status: statusSelect.value as 'todo' | 'doing' | 'done',
    };
    StoryService.update(updatedStory);
    // Przekierowanie do widoku stories danego projektu
    window.location.href = `/src/pages/project.html?id=${projectId}`;
  });
});
