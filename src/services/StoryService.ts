import { Story } from '../interfaces/Story';

class StoryService {
  private storageKey = 'stories';
  private lastStoryIdKeyPrefix = 'lastStoryId_';

  getAll(): Story[] {
    const stories = localStorage.getItem(this.storageKey);
    return stories ? JSON.parse(stories) : [];
  }

  getById(id: string): Story | undefined {
    const stories = this.getAll();
    return stories.find(story => story.id === id);
  }

  getNextStoryId(projectId: string): number {
    const lastIdKey = this.lastStoryIdKeyPrefix + projectId;
    let lastId = parseInt(localStorage.getItem(lastIdKey) || '0', 10);
    const nextId = lastId + 1;
    localStorage.setItem(lastIdKey, nextId.toString());
    return nextId;
  }
  
  create(story: Story, projectId: string): void {
    const stories = this.getAll();
    const nextId = this.getNextStoryId(projectId);
    story.id = `p${projectId}_${nextId}`;
    story.createdAt = new Date(); // Ustawianie daty utworzenia
    stories.push(story);
    this.save(stories);
  }

  update(updatedStory: Story): void {
    const stories = this.getAll();
    const storyIndex = stories.findIndex(story => story.id === updatedStory.id);
    if (storyIndex !== -1) {
      stories[storyIndex] = updatedStory;
      this.save(stories);
    }
  }

  delete(id: string): void {
    let stories = this.getAll();
    stories = stories.filter(story => story.id !== id);
    this.save(stories);
  }

  deleteStoriesByProject(projectId: string): void {
    let stories = this.getAll();
    stories = stories.filter(story => !story.id.startsWith(`p${projectId}_`));
    this.save(stories);
    this.resetStoryIdCounter(projectId); // Resetowanie licznika identyfikatorów po usunięciu projektu
  }

  private resetStoryIdCounter(projectId: string): void {
    const lastIdKey = this.lastStoryIdKeyPrefix + projectId;
    localStorage.removeItem(lastIdKey);
  }

  private save(stories: Story[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(stories));
  }
}

export default new StoryService();
