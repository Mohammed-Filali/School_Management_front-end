import { AxiosClient } from "../../../api/axios"


export const TasksApi = {
    tasks: async () => {
        return await AxiosClient.get('/api/tasks')
      },

      AddTask : async (values)=>{
        const {data} = await AxiosClient.post("/api/tasks", values )
    return data
    },

    update: async (values,id) => {
        return await AxiosClient.patch(`/api/tasks/${id}`, {...values, id})
      },
    delete: async (id) => {
        return await AxiosClient.delete(`/api/tasks/${id}`)
      },
}
