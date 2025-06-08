import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdminClasseList from "../data-table/classes/AdminClassesList";
import ClasseUpsertForm from "../forms/ClasseUpsertForm";
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi";
import { Card } from "@/components/ui/card";
import { List, PlusCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDispatch } from "react-redux";
import { addClasses_count } from "../../../redux/admin/adminCountsList";
import { toast } from "sonner";

export default function ManageClasses() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <Tabs defaultValue="classes_list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="classes_list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              {isDesktop ? "Class List" : "Classes"}
            </TabsTrigger>
            <TabsTrigger value="add_class" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {isDesktop ? "Add New Class" : "Add Class"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes_list" className="mt-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">All Classes</h2>
              <p className="text-muted-foreground">
                View and manage all class records
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="rounded-md border">
              <AdminClasseList />
            </div>
          </TabsContent>

          <TabsContent value="add_class" className="mt-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Create New Class</h2>
              <p className="text-muted-foreground">
                Add a new class to the system
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <Card className="p-6">
              <ClasseUpsertForm
                handleSubmit={async (values) => {
                  try {
                    await ClasseApi.create(values);
                    dispatch(addClasses_count())
                  } catch (error) {
                    
                  }
                }}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}