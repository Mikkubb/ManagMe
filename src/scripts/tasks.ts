import { checkAuth } from './auth';
import TaskService from '../services/TaskService';
import StoryService from '../services/StoryService';
import ProjectService from '../services/ProjectService';
import { Task } from '../interfaces/Task';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  const storyId = new URLSearchParams(window.location.search).get('storyId');
  const story = storyId ? StoryService.getById(storyId) : null;

  const storyNameElement = document.getElementById('story-name')!;
  const todoListElement = document.getElementById('todo-list')!;
  const doingListElement = document.getElementById('doing-list')!;
  const doneListElement = document.getElementById('done-list')!;
  const addTaskButton = document.getElementById('add-task')! as HTMLButtonElement;
  const backToStoriesButton = document.getElementById('back-to-stories')! as HTMLButtonElement;

  if (story) {
    storyNameElement.textContent = story.name;
    backToStoriesButton.onclick = () => {
      window.location.href = `project.html?projectId=${story.projectId}`;
    };
  } else {
    storyNameElement.textContent = 'No story selected';
    backToStoriesButton.onclick = () => {
      window.location.href = 'project.html';
    };
  }

  function renderTasks() {
    if (!story) {
      console.error('No story selected.');
      return;
    }

    const tasks = TaskService.getAll().filter(task => task.storyId === story.id);
    const project = ProjectService.getById(story.projectId);
    const projectName = project ? project.name : 'Unknown Project';

    todoListElement.innerHTML = '';
    doingListElement.innerHTML = '';
    doneListElement.innerHTML = '';

    tasks.forEach(task => {
      const taskHTML = `
        <div class="task-item">
          <div>ID: ${task.id}</div>
          <div>Name: ${task.name}</div>
          <div>Project Name: ${projectName}</div>
          <div>Priority: ${task.priority}</div>
          <div>Status: ${task.status}</div>
          <div>User Responsible: ${task.ownerId}</div>
          <div>Start Date: ${task.startDate ? formatDate(task.startDate) : 'N/A'}</div>
          <div>End Date: ${task.endDate ? formatDate(task.endDate) : 'N/A'}</div>
          <div>Expected Execution Time: ${task.expectedExecutionTime ? formatExpectedExecutionTime(task.expectedExecutionTime) : 'N/A'}</div>
          <div>
            <button class="task-details btn btn-success" data-id="${task.id}">Task Details</button>
            <button class="edit-task btn btn-warning" data-id="${task.id}">Edit</button>
            <button class="delete-task btn btn-danger" data-id="${task.id}">Delete</button>
          </div>
        </div>
      `;

      if (task.status === 'todo') {
        todoListElement.innerHTML += taskHTML;
      } else if (task.status === 'doing') {
        doingListElement.innerHTML += taskHTML;
      } else if (task.status === 'done') {
        doneListElement.innerHTML += taskHTML;
      }
    });

    const taskDetailsButtons = document.querySelectorAll('.task-details');
    taskDetailsButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const taskId = (event.target as HTMLElement).dataset.id;
        if (taskId) {
          window.location.href = `task-details.html?id=${taskId}`;
        } else {
          console.error('Task ID not found.');
        }
      });
    });

    const editTaskButtons = document.querySelectorAll('.edit-task');
    editTaskButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const taskId = (event.target as HTMLElement).dataset.id;
        if (taskId) {
          window.location.href = `edit-task.html?id=${taskId}`;
        } else {
          console.error('Task ID not found.');
        }
      });
    });

    const deleteTaskButtons = document.querySelectorAll('.delete-task');
    deleteTaskButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const taskId = (event.target as HTMLElement).dataset.id;
        if (taskId) {
          TaskService.delete(taskId);
          renderTasks();
        } else {
          console.error('Task ID not found.');
        }
      });
    });
  }

  function formatExpectedExecutionTime(expectedExecutionTime: { hours: number, date: Date }): string {
    const date = new Date(expectedExecutionTime.date);
    date.setHours(23, 59, 59);
    return `${expectedExecutionTime.hours} hours - ${formatDate(date)}`;
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

  renderTasks();

  addTaskButton.addEventListener('click', () => {
    if (story) {
      const taskNameInput = document.getElementById('task-name') as HTMLInputElement;
      const taskDescriptionInput = document.getElementById('task-description') as HTMLTextAreaElement;
      const taskPrioritySelect = document.getElementById('task-priority') as HTMLSelectElement;
      const taskStatusSelect = document.getElementById('task-status') as HTMLSelectElement;
      const taskHoursInput = document.getElementById('task-hours') as HTMLInputElement;
      const taskExpectedDateInput = document.getElementById('task-expected-date') as HTMLInputElement;
      const taskOwnerSelect = document.getElementById('task-owner') as HTMLSelectElement;

      if (taskNameInput.value.trim() === '' || taskDescriptionInput.value.trim() === '') {
        alert('Name and description fields must be filled out.');
        return;
      }

      const newTask: Task = {
        id: '',
        name: taskNameInput.value.trim(),
        description: taskDescriptionInput.value.trim(),
        priority: taskPrioritySelect.value as 'low' | 'medium' | 'high',
        storyId: story.id,
        createdAt: new Date(),
        status: taskStatusSelect.value as 'todo' | 'doing' | 'done',
        ownerId: taskOwnerSelect.value,
        expectedExecutionTime: {
          hours: parseInt(taskHoursInput.value, 10),
          date: new Date(taskExpectedDateInput.value)
        },
        startDate: taskStatusSelect.value === 'doing' ? new Date() : undefined,
        endDate: taskStatusSelect.value === 'done' ? new Date() : undefined
      };

      if (newTask.status === 'done' && !newTask.startDate) {
        newTask.startDate = newTask.endDate;
      }

      TaskService.create(newTask, story.id);
      renderTasks();
      taskNameInput.value = '';
      taskDescriptionInput.value = '';
      taskPrioritySelect.value = 'low';
      taskStatusSelect.value = 'todo';
      taskHoursInput.value = '';
      taskExpectedDateInput.value = '';
      taskOwnerSelect.value = 'devops';
    } else {
      console.error('No story selected.');
    }
  });
});
