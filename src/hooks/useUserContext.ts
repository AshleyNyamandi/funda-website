import { useContext } from "react";
import { UserContext } from "../context/userContext";

const useUserContext = () {
    const ctx = useContext(UserContext)
    if (!ctx) {
        throw new Error("user is undefined")
    }
    return ctx
}

export default useUserContext;