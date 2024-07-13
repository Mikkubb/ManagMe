export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'doing' | 'done';
    storyId: string;
    ownerId: string;
    createdAt: Date;
    startDate?: Date;
    endDate?: Date;
    expectedExecutionTime?: {
        hours: number;
        date: Date;
    };
}

export default Task;
