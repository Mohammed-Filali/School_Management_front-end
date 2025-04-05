import { AxiosClient } from "../../../../api/axios";



export const CourApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
      all: async () => {
        return await AxiosClient.get('/api/admin/cours')
      },
      update: async (values,id) => {
        return await AxiosClient.patch(`/api/admin/cours/${id}`, {...values, id})
      },
      delete: async (id) => {
        return await AxiosClient.delete(`/api/admin/cours/${id}`)
      },
      create: async (values) => {

        return await AxiosClient.post('/api/admin/cours', values)
      },
}


