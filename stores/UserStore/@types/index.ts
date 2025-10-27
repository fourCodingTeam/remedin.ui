export interface UserState {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoggingIn: boolean;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
  userId: number | null;
  setUserId: (personId: number | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}
