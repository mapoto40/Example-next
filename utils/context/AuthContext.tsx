import cookies from "@/utils/cookie";
import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

import { RolesPossible, User } from "@/types/components";
import session from "../session";
import { useRouter } from "next/router";
import { getCSRFToken, getUserData } from "../api";

type AuthContextType = {
    isAuth: true;
    loading: boolean;
    token: string;
    userData: User;
    logout: () => void;
    setToken: (token: string) => void;
    utils: {
        refreshData: () => void;
        hasRole: (role: RolesPossible | RolesPossible[]) => boolean;
        getRole: () => RolesPossible;
    };
} | {
    isAuth: false;
    loading: boolean;
    token: null;
    userData: null;
    logout: () => void;
    setToken: (token: string) => void;
    utils: {
        refreshData: () => void;
        hasRole: (role: RolesPossible | RolesPossible[]) => false;
        getRole: () => "user";
    };
}
export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider: FC<{ children: ReactNode }> = props => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();

    const logout = () => {
        setToken(null), setIsAuth(false), setUserData(null);
        cookies.remove('_token'), session.remove();

        if (typeof window !== 'undefined') {
            router.reload();
        } else setLoaded(false);
    }

    const refreshData = async () => { if (typeof window !== 'undefined' && isAuth && token){
        const { data: csrfToken } = await getCSRFToken();
        const { data } = await getUserData({ csrfToken, token });

        setUserData(data as User);
        session.set('user', data);
    }}

    // This function checks if the user has a specific role
    const hasRole = (role: RolesPossible | RolesPossible[]) => { if (typeof window !== 'undefined' && isAuth && userData && token) {
        if (typeof role === 'string') return userData.role.includes(role);
        else return (role as RolesPossible[]).some((r) => userData.role.includes(r as any));
    } else return false;}

    useEffect(() => { if (!loaded && typeof window !== 'undefined') {
        const token = cookies.get('_token');

        if (token) {
            setToken(token), setIsAuth(true);

            const user = session.get('user');
            if (user) {
                const userData = JSON.parse(user) as User;

                setUserData(userData);
                setLoaded(true);
            } else {
                getCSRFToken().then(( data ) => {
                    getUserData({ csrfToken: data.data, token }).then((data) => {
                        const theUser = data.data as User;

                        setUserData(theUser as User);
                        session.set('user', theUser);
                        setLoaded(true);
                    })
                })
            }
        } else {
            setLoaded(true);
        }

    }}, [])

    const getRole = () => { 
        if (typeof window !== 'undefined' && isAuth && userData)
            return userData.role[0];
        else return "user";
    }

    return (
        <AuthContext.Provider 
            value={{
                isAuth,
                loading: !loaded,
                token,
                userData,
                logout,
                setToken,
                utils: {
                    refreshData,
                    hasRole,
                    getRole
                }
            } as AuthContextType}
            {...props}
        />
    )
}

export const useContextAuth = () => useContext(AuthContext);