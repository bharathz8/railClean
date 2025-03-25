export interface User {
  id: string;
  email: string;
  role: 'admin' | 'worker';
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}