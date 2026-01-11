import type { User, Session } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { createContext, useState } from "react";

type UserContextType = {
  user: User | null;
  session: Session | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
 
const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    return (
        <UserContext.Provider value={{ user, session, setUser, setSession }}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContextProvider



