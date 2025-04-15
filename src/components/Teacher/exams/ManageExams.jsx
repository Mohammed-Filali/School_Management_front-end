import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExamUpsertForm from "./ExamUpsertForm";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TeacherExamsList from "./TeacherExamsliste";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function ManageExams() {
  return (
    <div className="w-full">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Exam Management
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-0">
          <Tabs defaultValue="exams_list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="exams_list">Exams List</TabsTrigger>
              <TabsTrigger value="add_exam">
                <Plus className="mr-2 h-4 w-4" />
                Add Exam
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exams_list" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">All Exams</h3>
                <Separator />
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <TeacherExamsList />
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="add_exam" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Create New Exam</h3>
                <Separator />
                <Card>
                  <CardContent className="pt-6">
                    <ExamUpsertForm 
                      handleSubmit={(values) => ExamApi.create(values)} 
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}