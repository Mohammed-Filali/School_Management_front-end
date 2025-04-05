import { AxiosClient } from "../../../../api/axios";
import ForgotPasswordForm from "../../../../components/forgotPassword";



export const AdminApi = {
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

    allsStudents: async ()=>{
        const {data} = await AxiosClient.get('/api/admin/students')
    return data
    },
    createStudent :async (values)=>{
        const {data} = await AxiosClient.post('/api/admin/students',values)
    return data
    },
    deleteStudent :  async (id)=>{
        const {data} = await AxiosClient.delete(`/api/admin/students/${id}` );
        return data
    },

    updateStudent: async (id,values)=>{
        console.log(values);

        const {data} = await AxiosClient.patch(`/api/admin/students/${id}`,values);
        return data
    },
    ForgotPassword: async (values)=>{

        const {data} = await AxiosClient.post('/forgot-password',values);
        return data
    },
    update_Password : async (values)=>{
        const {data} = await AxiosClient.post("/api/admin/update-password", values )
    return data
    },


}


