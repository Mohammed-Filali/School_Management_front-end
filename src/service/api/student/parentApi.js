import { AxiosClient } from "../../../api/axios";


export const SParentApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
    login : async (values)=>{
        const {data} = await AxiosClient.post("/login", values )
    return data
    },

    logout : async ()=>{
        return await AxiosClient.post("/logout" )

    },
    getUser: async () => {
        return await AxiosClient.get('/api/me')
      },

      exams: async () => {
        return await AxiosClient.get('/api/parent/Exams')
      },

      students: async () => {
        return await AxiosClient.get('/api/parent/students')
      },

      update_Password : async (values)=>{
        const {data} = await AxiosClient.post("/api/student/update-password", values )
    return data
    },

}


