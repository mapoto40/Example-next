import { ReactNode, memo } from "react";
import { useContextAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { notFound } from "next/navigation";
import { AdminSimple } from "@/components/admin/adminPages";

interface AuthMiddlewareProps {
    children?: ReactNode;
    admin?: boolean;
    redirect?: string;
    onlyAuth?: boolean;
}

const AuthMiddleware = ({ children, redirect, onlyAuth, admin }: AuthMiddlewareProps) => {
    const { isAuth, loading, userData, utils } = useContextAuth();
    const router = useRouter();
    // If no permission is set, return the children
    if(!admin && !onlyAuth) return children || "Nothing here";
    // If loading, return null
    if (loading) return null;
    // If onlyAuth is set, check if the user is authenticated
    if(onlyAuth && !isAuth){
        if (redirect) 
            router.push(redirect);
        return router.push("/_error")
    }
    // If admin is set, check if the user is admin
    if(admin && isAuth && !utils.hasRole("user")){
        console.log(!utils.hasRole("user"))
        return children;
    } else if (admin && (utils.hasRole("user") || !isAuth)){ // If the user is not admin, redirect
        if(redirect)
            router.push(redirect);
        router.push("/_error");
    }

    return children || "Nothing here";
}

const useAuth = () => {
    const all = useContextAuth();
    return {...all, AuthMiddleware};
}

export default useAuth;