import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ParentUpsertForm from "../forms/ParentUpsertForm";
import { ParentApi } from "../../../service/api/student/admins/parenpApi";
import AdminParentList from "../data-table/parent/AdminParentList";
import { Card } from "@/components/ui/card";
import { List, PlusCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UseUserContext } from "../../../context/StudentContext";

export default function ManageParents() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <Tabs defaultValue="parents_list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger 
              value="parents_list" 
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              {isDesktop ? "Parent List" : "Parents"}
            </TabsTrigger>
            <TabsTrigger 
              value="add_parent" 
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {isDesktop ? "Add New Parent" : "Add Parent"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parents_list" className="mt-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                All Parents
              </h2>
              <p className="text-muted-foreground">
                View and manage all parent records
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="rounded-md border">
              <AdminParentList />
            </div>
          </TabsContent>

          <TabsContent value="add_parent" className="mt-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Create New Parent
              </h2>
              <p className="text-muted-foreground">
                Add a new parent to the system
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <Card className="p-6">
              <ParentUpsertForm 
                handleSubmit={(values) => ParentApi.create(values)} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}