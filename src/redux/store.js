import { configureStore } from "@reduxjs/toolkit";
import userTasksList from './TasksSlice'
// Correct store configuration
export const Store = configureStore({
    reducer: { // This key is required
        userTasks:userTasksList
    },
});
