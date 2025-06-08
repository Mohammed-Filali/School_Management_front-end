import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdminTypeList from "../data-table/types/AdminTypeList";
import TypeUpsertForm from "../forms/TypeUpsertForm";
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi";
import { Card } from "@/components/ui/card";

export default function ManageType() {
  const handleCreateType = async (values) => {
    try {
      const response = await ClasseApi.createType(values);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="w-full">
      <Card className="p-4 md:p-6">
        <Tabs defaultValue="types_list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="types_list">Filiéres List</TabsTrigger>
            <TabsTrigger value="add_type">Add New Filiére</TabsTrigger>
          </TabsList>

          <TabsContent 
            value="types_list" 
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                All Filiéres
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage all available Filiéres in the system
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="rounded-md border">
              <AdminTypeList />
            </div>
          </TabsContent>

          <TabsContent 
            value="add_type" 
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Add New Filiére
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill out the form to create a new Filiére
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <TypeUpsertForm 
              handleSubmit={handleCreateType}
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