import { createSlice } from "@reduxjs/toolkit";

// Slice de gestion des tâches utilisateur
const userTasksList = createSlice({
  name: "userTasks",
  initialState: {
    tasks: [],  // Initialisation de la liste des tâches
    graphData: [], // Données pour le graphique
    last10Task: [], // Dernières 10 tâches
  },
  reducers: {
    setTasks: (state, action) => {
      // Vérification pour garantir que le payload est bien un tableau
      state.tasks = Array.isArray(action.payload) ? action.payload : [];
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload); // Ajout d'une nouvelle tâche
    },
    deleteTask: (state, action) => {
      // Suppression d'une tâche en vérifiant si tasks est un tableau
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      // Mise à jour d'une tâche, en vérifiant si c'est un tableau
      state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
    },
    setGraphData: (state, action) => {
      state.graphData = action.payload; // Définir les données du graphique
    },
    setLast10Task: (state, action) => {
      state.last10Task = action.payload; // Définir les dernières 10 tâches
    },
  },
});



// Export des actions
export const {
  setTasks,
  addTask,
  deleteTask,
  updateTask,
  setGraphData,
  setLast10Task,
} = userTasksList.actions;

// Export du reducer
export default userTasksList.reducer;
