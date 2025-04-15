import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CourUpsertForm from "../forms/CourUpsertForm";
import { CourApi } from "../../../service/api/student/admins/CourApi";
import AdminCourList from "../data-table/cours/AdminCourliste";
import { Card } from "@/components/ui/card";
import { PlusCircle, List } from "lucide-react";

export default function ManageCours() {
  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <Card className="p-6">
        <Tabs defaultValue="cours_list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="cours_list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Course List
            </TabsTrigger>
            <TabsTrigger value="add_course" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Course
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            value="cours_list" 
            className="mt-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                All Courses
              </h2>
              <p className="text-muted-foreground">
                Manage and view all available courses
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="rounded-md border">
              <AdminCourList />
            </div>
          </TabsContent>

          <TabsContent 
            value="add_course" 
            className="mt-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Create New Course
              </h2>
              <p className="text-muted-foreground">
                Add a new course to the system
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <Card className="p-6">
              <CourUpsertForm 
                handleSubmit={(values) => CourApi.create(values)} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}