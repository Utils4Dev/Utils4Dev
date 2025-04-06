import { UserDto } from "@src/api/models";
import { createContext, useContext } from "react";

type AuthContext = {
  user: UserDto | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContext);

export const useAuthContext = () => useContext(AuthContext);
