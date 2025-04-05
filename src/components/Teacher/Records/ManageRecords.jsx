

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

// import AdminParentList from "../data-table/AdminParentList.jsx";
import { Tabs ,TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";

import { useEffect, useState } from "react";
import { UseUserContext } from "../../../context/StudentContext";
import { TeacherApi } from "../../../service/api/student/teacherApi";
import { ClassTeacherApi } from "../../../service/api/student/teachers/classApi";
import TeacherRecordsList from "./TeacherRecordssliste";
import RecordsUpsertForm from "./RecordsUpsertForm";

export default function ManageRecords() {
    const [courClass, setCourClass] = useState([]);
    const [Classes, setClasses] = useState([]);
    const [CourC, setCourC] = useState([]);
    const [Clas, setClas] = useState([]); // Always an array, even if empty
    const { user } = UseUserContext();
    const [selectedClass,setSelectedClass]= useState()

    useEffect(() => {
      // Fetch data only if not already loaded

        TeacherApi.Classes().then(({ data }) => setClasses(data.data));
        ClassTeacherApi.classCour().then(({ data }) => setCourClass(data.data));


      // Update CourC based on user and courClass

    }, []); // Add CourC as a dependency
     useEffect(()=>{
        if (user && user.course && courClass.length > 0) {
            const matchedCourses = courClass.filter(
              (c) => c.course_id === user.course.id  && user.id===c.teacher_id
            );
            setCourC(matchedCourses);
          }

          // Update Clas based on CourC
          if (CourC.length > 0 && Classes.length > 0) {
            const matchedClasses = Classes.filter((c) =>
              CourC.some((course) => course.class_type_id === c.class_type_id)
            );
            setClas(matchedClasses); // Always an array of matched classes
          }
     },[user,Classes,courClass])
    return  <>
    <div className="relative overflow-x-auto w-full">
      <div className="hidden md:block">
        <div className="">
          <div className="grid">
            <div className="col-span-3 lg:col-span-4">
              <div className="h-full px-4 py-6 lg:px-8">
                <DropdownMenu className='absolute'>
                  <DropdownMenuTrigger className="w-full p-2 rounded-md text-left  ">
                    {Clas.length > 0 ? "Select a Class" : "No Classes Available"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-gray-100 z-10 shadow-md rounded-md p-2 ">
                    {Clas.length > 0 ? (
                      Clas.map((classItem) => (
                        <DropdownMenuItem
                          key={classItem.id}
                          onSelect={() => setSelectedClass(classItem)}
                          className="cursor-pointer text-gray-900 hover:bg-gray-200 rounded-md p-2"
                        >
                          {classItem.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled className="p-2 ">
                        No Classes Available
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="mt-4">
                  {selectedClass ? (
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {selectedClass.name}'s Records
                      </h2>
                      <TeacherRecordsList id={selectedClass.id} />
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4"></div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center ">No class selected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>



  }
