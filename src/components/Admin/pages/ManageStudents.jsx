import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { UseUserContext } from "../../../context/StudentContext.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator
} from "@radix-ui/react-dropdown-menu";
import StudentUpsertForm from "../forms/StudentUpsertForm.jsx";
import AdminStudentList from "../data-table/students/AdminStudentList.jsx";
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi.js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AdminApi } from "../../../service/api/student/admins/adminApi.js";
import { addStudents_count } from "../../../redux/admin/adminCountsList.js";
import { useDispatch } from "react-redux";

export default function ManageStudents() {
  const { user } = UseUserContext();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
const dispatch = useDispatch();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await ClasseApi.all();
        setClasses(data.data);
        if (data.data.length > 0) {
          setSelectedClass(data.data[0]); // Select first class by default
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <div className="bg-background rounded-lg shadow-sm border">
        <Tabs defaultValue="students_list" className="w-full">
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger 
                value="students_list" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 rounded-md transition-colors"
              >
                Students
              </TabsTrigger>
              <TabsTrigger 
                value="add_student" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 rounded-md transition-colors"
              >
                Add New Student
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="students_list" className="p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h2 className="text-xl font-semibold">Class Students</h2>
                    
                    {classes.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full sm:w-auto">
                            {selectedClass?.name || "Select Class"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-background border rounded-md shadow-lg z-50">
                          {classes.map((classItem) => (
                            <DropdownMenuItem
                              key={classItem.id}
                              onSelect={() => setSelectedClass(classItem)}
                              className="cursor-pointer px-4 py-2 hover:bg-accent focus:bg-accent"
                            >
                              {classItem.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {classes.length === 0 && (
                    <div className="mt-4 text-center text-muted-foreground">
                      No classes available
                    </div>
                  )}
                </div>

                {selectedClass ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-4">
                        {selectedClass.name} Students
                      </h3>
                      <AdminStudentList 
                        classe_id={selectedClass.id} 
                        className="w-full overflow-x-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {classes.length > 0 
                      ? "Please select a class" 
                      : "No classes available to display students"}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="add_student" className="p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Add New Student</h2>
              <div className="rounded-lg border p-4 md:p-6">
                <StudentUpsertForm 
                  handleSubmit={async(values) =>{ try{
                    await AdminApi.createStudent(values)
                    dispatch(addStudents_count())
                  }catch (error){
                    console.error("Failed to create student:", error);
                  }
                }} 
                  classes={classes}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}