import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdminTeacherList from "../data-table/teachers/AdminTeacherList";
import TeacherUpsertForm from "../forms/TeacherUpsertForm";
import { TeacherApi } from "../../../service/api/student/teacherApi";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { addTeachers_count } from "../../../redux/admin/adminCountsList";
import { toast } from "sonner";

export default function ManageTeachers() {
  const dispatch = useDispatch();
  const handleCreateTeacher = async (values) => {
    try {
       await TeacherApi.create(values);
      dispatch (addTeachers_count())
      toast.success('Teacher added seccessfuly')
      
    } catch (error) {
      toast.error('try again')
      throw error;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Card className="p-4 md:p-6">
        <Tabs defaultValue="teachers_list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 md:w-[400px]">
            <TabsTrigger value="teachers_list">Teachers List</TabsTrigger>
            <TabsTrigger value="add_teacher">Add New Teacher</TabsTrigger>
          </TabsList>

          <TabsContent 
            value="teachers_list" 
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                All Teachers
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage all registered teachers in the system
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <ScrollArea className="w-full rounded-md">
              <AdminTeacherList />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          <TabsContent 
            value="add_teacher" 
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Add New Teacher
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill out the form to register a new teacher
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <TeacherUpsertForm 
              handleSubmit={handleCreateTeacher} 
              onSuccess={() => {
                // You might want to add success handling here
                // For example, switch back to the list tab
              }}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}