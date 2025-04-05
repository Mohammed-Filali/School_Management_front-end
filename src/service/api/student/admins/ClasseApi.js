import { AxiosClient } from "../../../../api/axios"


export const ClasseApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
      all: async () => {
        return await AxiosClient.get('/api/admin/classes')
      },
      update: async (values,id) => {
        return await AxiosClient.patch(`/api/admin/classes/${id}`, {...values, id})
      },
      delete: async (id) => {
        return await AxiosClient.delete(`/api/admin/classes/${id}`)
      },
      create: async (values) => {

        return await AxiosClient.post('/api/admin/classes', values)
      },
      types: async () => {

        return await AxiosClient.get('/api/admin/classeTypes')
      },

      createType: async (values) => {
        console.log(values);

        return await AxiosClient.post('/api/admin/classeTypes', values)
      },
      updateType: async (values,id) => {
        console.log(values);

        return await AxiosClient.post(`/api/admin/classeTypes/${id}`, values)
      },
      deleteType: async (id) => {
        return await AxiosClient.delete(`/api/admin/classeTypes/${id}`)
      },

}


