import type { Models } from "react-native-appwrite";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { getCurrentUser } from "@/lib/appwrite";
import { GlobalContextType } from "@/types/types";

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  setIsLoggedIn: () => {},
  isLoggedIn: false,
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoggedIn,
        isLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
