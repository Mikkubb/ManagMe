import { Task } from '../interfaces/Task';

class TaskService {
    private storageKey = 'tasks';
    private lastTaskIdKeyPrefix = 'lastTaskId_';

    getAll(): Task[] {
        const tasks = localStorage.getItem(this.storageKey);
        return tasks ? JSON.parse(tasks) : [];
    }

    getById(id: string): Task | undefined {
        const tasks = this.getAll();
        return tasks.find(task => task.id === id);
    }

    getNextTaskId(storyId: string): number {
        const lastIdKey = this.lastTaskIdKeyPrefix + storyId;
        let lastId = parseInt(localStorage.getItem(lastIdKey) || '0', 10);
        const nextId = lastId + 1;
        localStorage.setItem(lastIdKey, nextId.toString());
        return nextId;
    }
  
    create(task: Task, storyId: string): void {
        const tasks = this.getAll();
        const nextId = this.getNextTaskId(storyId);
        task.id = `s${storyId}_${nextId}`;
        task.createdAt = new Date(); // Ustawianie daty utworzenia
        if (task.status === 'doing') {
            task.startDate = new Date();
        }
        if (task.status === 'done') {
            task.endDate = new Date();
            if (!task.startDate) {
                task.startDate = task.endDate;
            }
        }
        tasks.push(task);
        this.save(tasks);
    }

    update(updatedTask: Task): void {
        const tasks = this.getAll();
        const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            this.save(tasks);
        }
    }

    delete(id: string): void {
        let tasks = this.getAll();
        tasks = tasks.filter(task => task.id !== id);
        this.save(tasks);
    }

    deleteTasksByStory(storyId: string): void {
        let tasks = this.getAll();
        tasks = tasks.filter(task => !task.id.startsWith(`s${storyId}_`));
        this.save(tasks);
        this.resetTaskIdCounter(storyId); // Resetowanie licznika identyfikatorów po usunięciu historii
    }

    private resetTaskIdCounter(storyId: string): void {
        const lastIdKey = this.lastTaskIdKeyPrefix + storyId;
        localStorage.removeItem(lastIdKey);
    }

    private save(tasks: Task[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }
}

export default new TaskService();
