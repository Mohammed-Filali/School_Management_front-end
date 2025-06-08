import { configureStore } from "@reduxjs/toolkit";
import userTasksList from './TasksSlice'
import userExamsList from './Teacher/ExamsSlice'
import adminCountsList from './admin/adminCountsList'

export const Store = configureStore({
    reducer: { // This key is required
        userTasks:userTasksList,
        TeacherExams:userExamsList,
        AdminCountsList: adminCountsList,
    },
});
