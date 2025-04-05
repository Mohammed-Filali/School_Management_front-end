import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Layout from "../layouts/layout";
import GestLaoute from "../layouts/GestLaoute";
import StudentDashboardLayout from "../layouts/student/StudentDashboardLayout";
import StudentDashboard from "../components/Student/StudentDashboard";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminnDashboardLayout from "../layouts/admin/AdminnDashboardLayout";
import ParentDashboardLayout from "../layouts/StudentParent/ParentDashboardLayout";
import TeacherDashboardLayout from "../layouts/Teacher/TeacherDashboardLayout";
import TeacherDashboard from "../components/Teacher/TeacherDashboard";
import ManageParents from "../components/Admin/pages/ManageParents";
import ParentDashboard from "../components/parents/ParentDashboard";
import ManageStudents from "../components/Admin/pages/ManageStudents";
import ManageTeachers from "../components/Admin/pages/ManageTeachers";
import ManageCours from "../components/Admin/pages/ManageCours";
import ManageClasses from "../components/Admin/pages/ManageClasses";
import ManageExams from "../components/Teacher/exams/ManageExams";
import ManageRecords from "../components/Teacher/Records/ManageRecords";
import StudentManageRecords from "../components/Student/Records/StudentManageRecords";
import ParentManageRecord from "../components/parents/Records/ParentManageRecords";
import StudentRecordsDropdown from "../components/parents/Records/ParentManageRecords";
import { UseUserContext } from "../context/StudentContext";
import ForgotPasswordForm from "../components/forgotPassword";
import Tasks from "../pages/Tasks";
import StudentProfile from "../components/Student/StudentProfile";
import AdminProfile from "../components/Admin/AdminProfile";
import TeacherProfile from "../components/Teacher/TeaxherProfile";
import About from "../pages/about";
import ManageType from "../components/Admin/pages/ManageType";
import Formations from "../pages/Formations";

export const LOGIN_ROUTE = '/login'

// ------------------------------------------------------Student-----------------------------------------------


const STUDENT_BASE_ROUTE = '/student'
export const STUDENT_DUSHBOARD_ROUTE =STUDENT_BASE_ROUTE+'/dashboard'
export const STUDENT_PROFILE_ROUTE =STUDENT_BASE_ROUTE+'/profile'
export const STUDENT_MANAGE_EXAMS_ROUTE =STUDENT_BASE_ROUTE+'/manage-exams'
export const STUDENT_MANAGE_RECORDS_ROUTE =STUDENT_BASE_ROUTE+'/manage-records'
export const STUDENT_MANAGE_TASKS_ROUTE =STUDENT_BASE_ROUTE+'/manage-tasks'



// ------------------------------------------------------Admin-----------------------------------------------


const ADMIN_BASE_ROUTE = '/admin'
export const ADMIN_DUSHBOARD_ROUTE =ADMIN_BASE_ROUTE+'/dashboard'
export const ADMIN_PROFILE_ROUTE =ADMIN_BASE_ROUTE+'/profile'
export const ADMIN_MANAGE_PARENTS_ROUTE =ADMIN_BASE_ROUTE+'/manage-parents'
export const ADMIN_MANAGE_STUDENTS_ROUTE =ADMIN_BASE_ROUTE+'/manage-students'
export const ADMIN_MANAGE_TEACHERS_ROUTE =ADMIN_BASE_ROUTE+'/manage-teachers'
export const ADMIN_MANAGE_Clases_ROUTE =ADMIN_BASE_ROUTE+'/manage-classes'
export const ADMIN_MANAGE_Cours_ROUTE =ADMIN_BASE_ROUTE+'/manage-cours'
export const ADMIN_MANAGE_TASKS_ROUTE =ADMIN_BASE_ROUTE+'/manage-tasks'
export const ADMIN_MANAGE_TYPES_ROUTE =ADMIN_BASE_ROUTE+'/manage-types'






// ------------------------------------------------------Teacher-----------------------------------------------


const TEACHER_BASE_ROUTE = '/teacher'
export const TEACHER_MANAGE_EXAMS_ROUTE =TEACHER_BASE_ROUTE+'/manage-exams'
export const TEACHER_MANAGE_RECORDS_ROUTE =TEACHER_BASE_ROUTE+'/manage-records'
export const TEACHER_DASHBOARD_ROUTE = '/teacher/dashboard'
export const TEACHER_PROFILE_ROUTE = '/teacher/profile'
export const TEACHER_MANAGE_TASKS_ROUTE = '/teacher/manage-tasks'






// ------------------------------------------------------Parent-----------------------------------------------


const PARENT_BASE_ROUTE = '/parent'
export const PARENT_DUSHBOARD_ROUTE =PARENT_BASE_ROUTE+'/dashboard'
export const PARENT_MANAGE_RECORDS_ROUTE =PARENT_BASE_ROUTE+'/manage-records'
export const PARENT_MANAGE_TASKS_ROUTE =PARENT_BASE_ROUTE+'/manage-tasks'







export const RedirectRoute =(role)=>{
    switch (role){
        case 'student':
            return STUDENT_DUSHBOARD_ROUTE

        case 'admin':
                return ADMIN_DUSHBOARD_ROUTE

        case 'teacher':
            return TEACHER_DASHBOARD_ROUTE

        case 'parent':
            return PARENT_DUSHBOARD_ROUTE


    }
}





export const  Router = createBrowserRouter([
    {
        element : <Layout />,
        children:[{
            path: "/",
           element: <Home />,

          },
          {
            path: "/about",
           element: <About />,

          },
          {
            path: "/formations",
           element: <Formations />,

          },

          {
            path: "*",
           element: <h1>Not found</h1>,

          },]
    },
    {
        element : <GestLaoute /> ,
        children :[
            {
                path: "/login",
               element: <Login />,

              },
              {
                path: "/formations",
               element: <Formations />,

              },
              {
                path: "/about",
               element: <About />,

              },
              {
                path: "/forgot_Password",
               element: <ForgotPasswordForm />,

              },
        ]
    } ,

    // ----------------------------------------------------Student-------------------------------------------
    {
        element : <StudentDashboardLayout /> ,
        children :[
            {
                path: STUDENT_DUSHBOARD_ROUTE,
               element: <StudentDashboard />,

              },
              {
                path: STUDENT_PROFILE_ROUTE,
               element: <StudentProfile />,

              },


              {
                path: STUDENT_MANAGE_RECORDS_ROUTE,
               element: <StudentManageRecords />,

              },

              {
                path: STUDENT_MANAGE_TASKS_ROUTE,
               element: <Tasks />,

              },

        ]
    },

    // ----------------------------------------------------Admin-------------------------------------------

    {
        element : <AdminnDashboardLayout /> ,
        children :[
            {
                path: ADMIN_DUSHBOARD_ROUTE,
               element: <AdminDashboard />,

              },
              {
                path: ADMIN_PROFILE_ROUTE,
               element: <AdminProfile />,

              },

              {
                path: ADMIN_MANAGE_PARENTS_ROUTE,
               element: <ManageParents />,

              },
              {
                path: ADMIN_MANAGE_TYPES_ROUTE,
               element: <ManageType />,

              },
              {
                path: ADMIN_MANAGE_STUDENTS_ROUTE,
               element: <ManageStudents />,

              },
              {
                path: ADMIN_MANAGE_TEACHERS_ROUTE,
               element: <ManageTeachers />,

              },
              {
                path: ADMIN_MANAGE_Clases_ROUTE,
                element: <ManageClasses />,

              },
              {
                path: ADMIN_MANAGE_Cours_ROUTE,

               element: <ManageCours />,

              },
              {
                path: ADMIN_MANAGE_TASKS_ROUTE,

               element: <Tasks />,

              },
        ]
    },


        // ----------------------------------------------------Parent-------------------------------------------

    {
        element: <ParentDashboardLayout />,
        children: [
          {
            path: PARENT_DUSHBOARD_ROUTE,
            element: <ParentDashboard/>
          },

          {
            path: PARENT_MANAGE_RECORDS_ROUTE,
           element: <StudentRecordsDropdown  />,

          },
          {
            path: PARENT_MANAGE_TASKS_ROUTE,
           element: <Tasks  />,

          },
        ]
      },

          // ----------------------------------------------------Teacher-------------------------------------------

      {
        element: <TeacherDashboardLayout/>,
        children: [
          {
            path: TEACHER_DASHBOARD_ROUTE,
            element: <TeacherDashboard/>
          },
          {
            path: TEACHER_PROFILE_ROUTE,
            element: <TeacherProfile/>
          },

          {
            path: TEACHER_MANAGE_EXAMS_ROUTE,
           element: <ManageExams />,

          },
          {
            path: TEACHER_MANAGE_RECORDS_ROUTE,
           element: <ManageRecords />,

          },
          {
            path: TEACHER_MANAGE_TASKS_ROUTE,
           element: <Tasks />,

          },
        ]
      }
])
