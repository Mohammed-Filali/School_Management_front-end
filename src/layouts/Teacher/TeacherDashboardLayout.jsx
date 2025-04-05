import {Link, Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState,} from "react";
import { UseUserContext } from "../../context/StudentContext.jsx";
// import UserApi from "../services/Api/UserApi.js";
import {GaugeIcon} from "lucide-react";
import {ModeToggle} from "../../components/mode-toggle.jsx";
import {TeacherAdministrationSideBar} from "../Administration/TeacherAdministrationSideBar.jsx";
import { LOGIN_ROUTE,RedirectRoute, TEACHER_DASHBOARD_ROUTE } from "../../router/index.jsx";
import TeacherDropDownMenu from "./TeacherDropDownMenu.jsx";
import { TeacherApi } from "../../service/api/student/teacherApi.js";
import IGO from '../../assets/Logo.png'

export default function TeacherDashboardLayout() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const { authenticated, setUser, setAuthenticated, logout: contextLogout } = UseUserContext();

   useEffect(() => {
     if (authenticated) {
       setIsLoading(false);
       TeacherApi.getUser()
         .then(({ data }) => {
             setIsLoading(false)
             const {role} = data
                     if(role !== 'teacher') {
                       navigate(RedirectRoute(role));
                     }
           setUser(data);
           setAuthenticated(true);
         })
         .catch((error) => {
           console.error("Failed to fetch user data:", error);

         });
     }else if (!authenticated){
         setIsLoading(false)
         contextLogout();
         navigate(LOGIN_ROUTE);

     }
   }, [authenticated]);


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>
    <header>
        <div className=" bg-white  max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">

                <div className=" flex items-center">
                      <img src={IGO} className="start-0" width={'200px'} alt="" />
                    </div>


                <div>
              <ul className="flex text-white place-items-center">
                <li className="ml-5 px-2 py-1">
                  <Link className="flex items-center  text-gray-900 " to={TEACHER_DASHBOARD_ROUTE}><GaugeIcon className={'mx-1'}/>Dashboard</Link>
                </li>
                <li className="ml-5 px-2 py-1">
                  <TeacherDropDownMenu/>
                </li>
                <li className="ml-5 px-2 py-1">
                  <ModeToggle/>
                </li>
              </ul>
                </div>
            </div>
          </div>
        </header>
    <hr/>
    <main className={'mx-auto px-10 space-y-4 py-4'}>
      <div className="flex">
        <div className={'w-full md:w-1/4'}>
          <TeacherAdministrationSideBar/>
        </div>
        <div className={'w-full md:w-3/4'}>
          <Outlet/>
        </div>
      </div>
    </main>
  </>
}
