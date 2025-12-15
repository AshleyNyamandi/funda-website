import type { User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { createContext } from "react";

export const UserContext = createContext<User | undefined>(undefined)
 
const UserContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <UserContext.Provider value={undefined}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContextProvider



