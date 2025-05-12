import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

type LoginType = {
    email: string;
    password: string;
    remember_me?: boolean | undefined;
}

interface ProviderProps {
    user:  string | null,
    token:  string,
    login (data: LoginType ): void,
    logout() :void,
}

const AuthContext = createContext<ProviderProps>({
    user: null,
    token: '',
    login: () => {},
    logout: () => {}
})

export const randomAlphaNumeric = (length: number) => {
    let s = '';
    Array.from({ length }).some(() => {
      s += Math.random().toString(36).slice(2);
      return s.length >= length;
    });
    return s.slice(0, length);
};

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const storedInfo =  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null
    const [user, setUser ] = useState<string | null>(storedInfo?.email)
    const [ token, setToken ] = useState( storedInfo?.token || '')
    const naigate = useNavigate()

    const login = (data:LoginType ) => {
        
        const t = randomAlphaNumeric(50)
        const obj = { ...data,token: t }
        setUser(data.email)
        setToken(t)
        localStorage.setItem('user',JSON.stringify(obj))
        naigate('/')
    }

    const logout = () => {
        setUser(null)
        setToken('')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user,token, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext)
}