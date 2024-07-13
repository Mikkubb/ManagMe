import UserService from '../services/UserService';
import { User } from '../interfaces/User';

class UserManager {
    private loggedInUser: User | null = null;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        const users = UserService.getAll();
        if (users.length === 0) {
            UserService.initializeMockUsers();
        }
        const adminUser = users.find(user => user.role === 'admin') || null;
        if (adminUser) {
            this.setLoggedInUser(adminUser);
        } else {
            console.error('No admin user found.');
        }
    }

    public getLoggedInUser(): User | null {
        return this.loggedInUser;
    }

    public setLoggedInUser(user: User): void {
        this.loggedInUser = user;
    }

    public logout(): void {
        this.loggedInUser = null;
    }
}

export default new UserManager();
