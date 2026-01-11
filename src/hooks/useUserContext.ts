import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const useUserContext = () =>{
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("user is undefined")
    }
    return context
}

export default useUserContext;