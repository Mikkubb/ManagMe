import TaskService from '../services/TaskService';
import StoryService from '../services/StoryService';
import { checkAuth } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const taskId = new URLSearchParams(window.location.search).get('id');
    const task = taskId ? TaskService.getById(taskId) : null;

    const taskNameInput = document.getElementById('task-name') as HTMLInputElement;
    const taskDescriptionInput = document.getElementById('task-description') as HTMLTextAreaElement;
    const taskPrioritySelect = document.getElementById('task-priority') as HTMLSelectElement;
    const taskStatusSelect = document.getElementById('task-status') as HTMLSelectElement;
    const taskHoursInput = document.getElementById('task-hours') as HTMLInputElement;
    const taskExpectedDateInput = document.getElementById('task-expected-date') as HTMLInputElement;
    const taskOwnerSelect = document.getElementById('task-owner') as HTMLSelectElement;
    const taskStartDateInput = document.getElementById('task-start-date') as HTMLInputElement;
    const taskEndDateInput = document.getElementById('task-end-date') as HTMLInputElement;
    const saveTaskButton = document.getElementById('save-task') as HTMLButtonElement;
    const backToTasksLink = document.getElementById('back-to-tasks') as HTMLAnchorElement;

    if (task) {
        taskNameInput.value = task.name;
        taskDescriptionInput.value = task.description;
        taskPrioritySelect.value = task.priority;
        taskStatusSelect.value = task.status;
        taskHoursInput.value = task.expectedExecutionTime?.hours.toString() || '';

        const expectedExecutionDate = task.expectedExecutionTime?.date ? new Date(task.expectedExecutionTime.date) : null;
        taskExpectedDateInput.value = expectedExecutionDate ? expectedExecutionDate.toISOString().split('T')[0] : '';

        taskOwnerSelect.value = task.ownerId;
        taskStartDateInput.value = task.startDate ? adjustForTimezone(new Date(task.startDate).toISOString()) : '';
        taskEndDateInput.value = task.endDate ? adjustForTimezone(new Date(task.endDate).toISOString()) : '';

        const story = StoryService.getById(task.storyId);
        if (story) {
            backToTasksLink.href = `tasks.html?storyId=${task.storyId}`;
        } else {
            console.error('No story found for the task.');
            backToTasksLink.href = 'tasks.html';
        }
    } else {
        console.error('No task selected.');
        backToTasksLink.href = 'tasks.html';
    }

    function getCurrentDateTime(): string {
        const now = new Date();
        now.setHours(now.getHours() + 2); // Adjust for GMT+2
        return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    }

    function adjustForTimezone(dateString: string): string {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 2); // Adjust for GMT+2
        return date.toISOString().slice(0, 16);
    }

    // Funkcja aktualizująca pola Start Date i End Date w zależności od statusu
    function updateDatesByStatus(status: string) {
        const currentDateTime = getCurrentDateTime();
        if (task) {
            switch (status) {
                case 'todo':
                    taskStartDateInput.value = '';
                    taskEndDateInput.value = '';
                    break;
                case 'doing':
                    if (!task.startDate) {
                        taskStartDateInput.value = currentDateTime;
                    }
                    taskEndDateInput.value = '';
                    break;
                case 'done':
                    if (!task.startDate) {
                        taskStartDateInput.value = currentDateTime;
                    }
                    taskEndDateInput.value = currentDateTime;
                    break;
                default:
                    break;
            }
        }
    }

    // Nasłuchiwanie zmiany statusu i aktualizacja pól Start Date i End Date
    taskStatusSelect.addEventListener('change', () => {
        updateDatesByStatus(taskStatusSelect.value);
    });

    saveTaskButton.addEventListener('click', () => {
        if (task) {
            task.name = taskNameInput.value.trim();
            task.description = taskDescriptionInput.value.trim();
            task.priority = taskPrioritySelect.value as 'low' | 'medium' | 'high';
            task.status = taskStatusSelect.value as 'todo' | 'doing' | 'done';
            task.expectedExecutionTime = {
                hours: parseInt(taskHoursInput.value, 10),
                date: new Date(taskExpectedDateInput.value)
            };
            task.ownerId = taskOwnerSelect.value;
            task.startDate = taskStartDateInput.value ? new Date(taskStartDateInput.value) : undefined;
            task.endDate = taskEndDateInput.value ? new Date(taskEndDateInput.value) : undefined;

            TaskService.update(task);
            window.location.href = backToTasksLink.href;
        } else {
            console.error('No task selected.');
        }
    });
});
