import { AxiosClient } from "../../../../api/axios"


export const ClasseCoursApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
      all: async () => {
        return await AxiosClient.get('/api/admin/classeCoursTypes')
      },
      update: async (values,id) => {
        return await AxiosClient.patch(`/api/admin/classeCoursTypes/${id}`, {...values, id})
      },
      delete: async (id) => {
        return await AxiosClient.delete(`/api/admin/classeCoursTypes/${id}`)
      },
      create: async (values) => {

        return await AxiosClient.post('/api/admin/classeCoursTypes', values)
      },
      

}


