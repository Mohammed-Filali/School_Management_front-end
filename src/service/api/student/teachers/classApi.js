import { AxiosClient } from "../../../../api/axios";



export const ClassTeacherApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
      classCour: async () => {
        return await AxiosClient.get('api/teacher/classeCoursTypes')
      },
      classType: async () => {
        return await AxiosClient.get('api/teacher/classeTypes')
      },
      students: async () => {
        return await AxiosClient.get('api/teacher/students ')
      },

}


