import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UseUserContext } from "../../../context/StudentContext";
import RecordsUpsertForm from "./RecordsUpsertForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherRecordsList from "./TeacherTotalRecordssliste";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function ManageRecords() {
  const { user } = UseUserContext();
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (user?.classes) {
      // Extract all classes from the teacher's classes
      const allClasses = user.classes.flatMap(classe => 
        classe.class_type?.classe?.map(c => ({
          ...c,
          class_type_name: classe.class_type?.name
        })) || []
      );
      
      setFilteredClasses(allClasses);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-8 w-[300px]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Records</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-64 justify-between">
                {selectedClass ? selectedClass.name : "Select a Class"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {filteredClasses.length > 0 ? (
                filteredClasses.map(classItem => (
                  <DropdownMenuItem
                    key={classItem.id}
                    onSelect={() => setSelectedClass(classItem)}
                    className="cursor-pointer"
                  >
                    {classItem.name} ({classItem.class_type_name})
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No Classes Available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedClass ? (
          <div className="space-y-4">
            <Tabs defaultValue="records">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="records">Records</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="mt-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {selectedClass.name}'s Records
                  </h3>
                  <Separator />
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <TeacherRecordsList id={selectedClass.id} />
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              {filteredClasses.length > 0 
                ? "Please select a class to view records" 
                : "No classes available for your courses"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}