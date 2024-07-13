export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  createdAt: Date;
  status: 'todo' | 'doing' | 'done';
}

export default Story;