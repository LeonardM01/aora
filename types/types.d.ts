export type User = {
  accountId: string;
  email: string;
  password: string;
  avatarUrl: string;
};

export type GlobalContextType = {
  user: Models.Document | null;
  setUser: (user: Models.Document | null) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (loading: boolean) => void;
};
