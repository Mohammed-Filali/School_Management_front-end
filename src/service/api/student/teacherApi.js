import { AxiosClient } from "../../../api/axios"


export const TeacherApi = {
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
      all: async () => {
        return await AxiosClient.get('/api/admin/teachers')
      },
      update: async (values,id)=>{

        const {data} = await AxiosClient.patch(`/api/admin/teachers/${id}`,values);
        return data
    },

      delete: async (id) => {
        return await AxiosClient.delete(`/api/admin/teachers/${id}`)
      },
      create: async (values) => {

        return await AxiosClient.post('/api/admin/teachers', values)
      },
      Classes: async () => {
        return await AxiosClient.get('api/teacher/classes')
      },

      Cours: async () => {
        return await AxiosClient.get('api/teacher/cours')
      },
      update_Password : async (values)=>{
        const {data} = await AxiosClient.post("/api/student/update-password", values )
    return data
    },
}


