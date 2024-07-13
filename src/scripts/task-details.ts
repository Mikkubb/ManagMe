import TaskService from '../services/TaskService';
import StoryService from '../services/StoryService';
import ProjectService from '../services/ProjectService';
import { checkAuth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const taskId = new URLSearchParams(window.location.search).get('id');
    const task = taskId ? TaskService.getById(taskId) : null;
  
    const taskIdElement = document.getElementById('task-id')!;
    const taskNameElement = document.getElementById('task-name')!;
    const taskDescriptionElement = document.getElementById('task-description')!;
    const taskPriorityElement = document.getElementById('task-priority')!;
    const taskStatusElement = document.getElementById('task-status')!;
    const taskCreatedDateElement = document.getElementById('task-created-date')!;
    const taskExpectedExecutionTimeElement = document.getElementById('task-expected-execution-time')!;
    const taskStartDateElement = document.getElementById('task-start-date')!;
    const taskEndDateElement = document.getElementById('task-end-date')!;
    const taskOwnerElement = document.getElementById('task-owner-id')!;
    const projectNameElement = document.getElementById('project-name')!;
    const storyNameElement = document.getElementById('story-name')!;
    const backToTasksButton = document.getElementById('back-to-tasks')! as HTMLAnchorElement;
  
    if (task) {
        const story = StoryService.getById(task.storyId);
        const project = story ? ProjectService.getById(story.projectId) : null;

        taskIdElement.textContent = task.id;
        taskNameElement.textContent = task.name;
        taskDescriptionElement.textContent = task.description;
        taskPriorityElement.textContent = task.priority;
        taskStatusElement.textContent = task.status;
        taskCreatedDateElement.textContent = task.createdAt ? formatDate(task.createdAt) : 'N/A';
        taskOwnerElement.textContent = task.ownerId;
        projectNameElement.textContent = project ? project.name : 'N/A';
        storyNameElement.textContent = story ? story.name : 'N/A';

        if (task.expectedExecutionTime) {
            taskExpectedExecutionTimeElement.textContent = `${task.expectedExecutionTime.hours} hours - ${formatDate(setEndOfDay(task.expectedExecutionTime.date))}`;
        } else {
            taskExpectedExecutionTimeElement.textContent = 'N/A';
        }

        taskStartDateElement.textContent = task.startDate ? formatDate(task.startDate) : 'N/A';
        taskEndDateElement.textContent = task.endDate ? formatDate(task.endDate) : 'N/A';

        backToTasksButton.href = `tasks.html?storyId=${task.storyId}`;
    } else {
        taskIdElement.textContent = 'N/A';
        taskNameElement.textContent = 'N/A';
        taskDescriptionElement.textContent = 'N/A';
        taskPriorityElement.textContent = 'N/A';
        taskStatusElement.textContent = 'N/A';
        taskCreatedDateElement.textContent = 'N/A';
        taskOwnerElement.textContent = 'N/A';
        taskExpectedExecutionTimeElement.textContent = 'N/A';
        taskStartDateElement.textContent = 'N/A';
        taskEndDateElement.textContent = 'N/A';
        projectNameElement.textContent = 'N/A';
        storyNameElement.textContent = 'N/A';
        backToTasksButton.href = 'tasks.html';
    }

    function setEndOfDay(date: Date): Date {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 999);
        return newDate;
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
});
