import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { STUDENT_DUSHBOARD_ROUTE } from "../router";
import { UseUserContext } from "../context/StudentContext";
import {Home , Info, LogIn } from "lucide-react";
import { ModeToggle } from "../components/mode-toggle";
import IGO from '../assets/Logo.png';

export default function GestLaoute(){

    const navigate = useNavigate()


    const context = UseUserContext()
    useEffect(()=>{
        if(context.authenticated){
            navigate(STUDENT_DUSHBOARD_ROUTE)
        }
    },[])


    return<>


    <header>

    <nav className=" bg-white  shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">

        <div className=" flex items-center">
          <img src={IGO} className="start-0" width={'200px'} alt="" />
        </div>


        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800"><Home /></Link>
          <Link to="/login" className="text-gray-600 hover:text-gray-800"><LogIn  /></Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-800"><Info  /></Link>
          <Link to="/formations" className="text-gray-600 hover:text-gray-800"> Formations</Link>

          <ModeToggle />
        </div>



      </div>
    </div>



  </nav>
    </header>

    <main>
        <Outlet />
    </main>


    <footer></footer>
    </>
}
