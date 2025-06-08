import { createSlice } from "@reduxjs/toolkit";

const adminCountsList = createSlice({
  name: "adminCounts",
  initialState: {
    teachers_count: 0,
    students_count: 0,
    classes_count: 0,
    attendances_count: 0,
  },
  reducers: {
    setTeachers_count: (state, action) => {
      state.teachers_count = action.payload;
    },
    setStudents_count: (state, action) => {
      state.students_count = action.payload;
    },
    setClasses_count: (state, action) => {
      state.classes_count = action.payload;
    },
    setAttendances_count: (state, action) => {
      state.attendances_count = action.payload;
    },

    // ✅ Ces reducers étaient mal placés
    addTeachers_count: (state) => {
      state.teachers_count += 1;
    },
    addStudents_count: (state) => {
      state.students_count += 1;
    },
    addClasses_count: (state) => {
      state.classes_count += 1;
    },
    addAttendances_count: (state) => {
      state.attendances_count += 1;
    },
    deleteTeachers_count: (state) => {
      state.teachers_count -= 1;
    },
    deleteStudents_count: (state) => {
      state.students_count -= 1;
    },
    deleteClasses_count: (state) => {
      state.classes_count -= 1;
    },
    
    // ✅ Ces reducers étaient mal placés
  },
});

// Export des actions
export const {
  setTeachers_count,
  setStudents_count,
  setClasses_count,
  setAttendances_count,
  addTeachers_count,
  addStudents_count,
  addClasses_count,
  addAttendances_count,
  deleteTeachers_count,
  deleteStudents_count,
  deleteClasses_count,

} = adminCountsList.actions;

// Export du reducer
export default adminCountsList.reducer;
