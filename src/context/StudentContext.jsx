import { createContext, useState } from "react";
import { useContext } from "react"
import { StudentApi } from "../service/api/student/studentApi";


 const StudentstateContext = createContext({
    user: null,
    authenticated :false ,
    setUser: ()=>{},
    logout: ()=>{},
    login: (values)=>{},
    setAuthenticated : ()=>{},
    setToken :()=>{}
})

export default function StudentContext({children}){
    const [user,setUser] = useState()
   

    const [authenticated , _setAuthenticated] = useState('true'=== window.localStorage.getItem('AUTHENTIFICARED'))

    const login = async (values)=> {

         await StudentApi.getCsrfToken()
         return await StudentApi.login(values)
    }

    const setAuthenticated=(isAuth)=>{
        _setAuthenticated(isAuth)
        window.localStorage.setItem('AUTHENTIFICARED',isAuth)

    }

    const setToken = (token) => {
        window.localStorage.setItem('token', token)
    }



    const logout = ()=>{
        setUser({})
        setToken(false)
        setAuthenticated(false)

    }




return <>
    <StudentstateContext.Provider value={{
        user,
        setUser,
        authenticated,
        setAuthenticated,
        logout,
        login,
        setToken,
     }}>
        {children}
    </StudentstateContext.Provider>
</>
}

export const UseUserContext = ()=>{
   return useContext(StudentstateContext)
}
