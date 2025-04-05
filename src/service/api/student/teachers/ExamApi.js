import { AxiosClient } from "../../../../api/axios";



export const ExamApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
      all: async () => {
        return await AxiosClient.get('api/teacher/Exams')
      },
      update: async (values,id) => {
        return await AxiosClient.patch(`api/teacher/Exams/${id}`, {...values, id})
      },
      delete: async (id) => {
        return await AxiosClient.delete(`api/teacher/Exams/${id}`)
      },
      create: async (values) => {

        return await AxiosClient.post('api/teacher/Exams', values)
      },
      createRecord: async (values) => {

        return await AxiosClient.post('api/teacher/Records', values)
      },
      allRecords: async () => {
        return await AxiosClient.get('api/teacher/Records')
      },
}


