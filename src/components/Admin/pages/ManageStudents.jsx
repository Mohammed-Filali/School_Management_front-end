

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

// import AdminParentList from "../data-table/AdminParentList.jsx";
import { Tabs ,TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";
import { UseUserContext } from "../../../context/StudentContext.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
import StudentUpsertForm from "../forms/StudentUpsertForm.jsx";
import AdminStudentList from "../data-table/students/AdminStudentList.jsx";
import { StudentApi } from "../../../service/api/student/studentApi.js";
import { AdminApi } from "../../../service/api/student/admins/adminApi.js";
import { useEffect, useState } from "react";
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi.js";

export default function ManageStudents() {
    const { user } = UseUserContext();
    const [Clas,setClas] = useState([]);
    const [selectedClass,setSelectedClass]=useState()

    useEffect(()=>{
        ClasseApi.all().then(({data})=>{
            setClas(data.data)
        })
    },[])

    return (
      <>
        <div className="relative overflow-x-auto w-full">
          <div className="hidden md:block">
            <div className="bg-background">
              <div className="grid">
                <div className="col-span-3 lg:col-span-4">
                  <div className="h-full px-4 py-6 lg:px-8">
                    {/* Change w-[500px] to w-full to make it take the full width */}
                    <Tabs defaultValue="parents_list" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="parents_list">Students</TabsTrigger>
                        <TabsTrigger value="add_parent">Add new student</TabsTrigger>
                      </TabsList>

                      <TabsContent value="parents_list" className="border-none p-0 outline-none">
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
                                    {selectedClass.name}
                                  </h2>
                                  <AdminStudentList classe_id={selectedClass.id} />
                                  {console.log(selectedClass.id)}
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
                      </TabsContent>

                      <TabsContent value="add_parent">
                        <div className="space-y-1">
                          <StudentUpsertForm handleSubmit={(values) => AdminApi.createStudent(values)}  />
                        </div>
                        <Separator className="my-4" />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
