import { AxiosClient } from "../../../../api/axios";


export const ParentApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
    login : async (values)=>{
        const {data} = await AxiosClient.post("/login", values )
    return data
    },
    create : async (values)=>{
        const {data} = await AxiosClient.post("/api/admin/parents", values )
    return data
    },
    all : async ()=>{
        const {data} = await AxiosClient.get("/api/admin/parents" )
    return data
    },
    logout : async ()=>{
        return await AxiosClient.post("/logout" )

    },
    getUser: async () => {
        return await AxiosClient.get('/api/me')
      },


    delete :  async (id)=>{
        const {data} = await AxiosClient.delete(`/api/admin/parents/${id}` );
        return data
    },

    update: async (values,id)=>{

        const {data} = await AxiosClient.patch(`/api/admin/parents/${id}`,values);
        return data
    }

}


