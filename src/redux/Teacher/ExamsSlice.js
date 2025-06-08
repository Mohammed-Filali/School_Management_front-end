import { createSlice } from "@reduxjs/toolkit";

// Slice de gestion des examens utilisateur
const userExamsList = createSlice({
  name: "userExams",
  initialState: {
    exams: [], 
    totalExams : 0 // Initialisation de la liste des examens
  },
  reducers: {
    setExams: (state, action) => {
      // Vérification pour garantir que le payload est bien un tableau
      state.exams = Array.isArray(action.payload) ? action.payload : [];
            state.totalExams = state.exams.length;

    },
    addExam: (state, action) => {
      state.exams.push(action.payload);
      state.totalExams = state.totalExams+1;
      console.log("Exam added:", action.payload);
      // Ajout d'un nouvel examen
    },

    
       
  },
});



// Export des actions
export const {
  setExams,
  addExam,
 

} = userExamsList.actions;

// Export du reducer
export default userExamsList.reducer;
