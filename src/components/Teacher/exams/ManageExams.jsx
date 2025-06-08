import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamUpsertForm from "./ExamUpsertForm";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TeacherExamsList from "./TeacherExamsliste";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addExam } from "../../../redux/Teacher/ExamsSlice";

export default function ManageExams() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exams = useSelector((state) => state.TeacherExams.exams); 
// Get exams from Redux
  const dispatch = useDispatch(); // Assuming you have set up Redux and useDispatch
  // assuming you have a state for exams
    
    
  const handleCreateExam = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await ExamApi.create(values);
      
      if (response.status === 200) {
        dispatch(addExam( response.data.Exame));
        console.log("Exam created successfully:", response.data.Exame);
        
        toast.success("Exam created successfully");
        
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error(error.response?.data?.message || "Failed to create exam");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Card>
                  <CardContent className="pt-6">
                    <TeacherExamsList  exams={exams}  />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="add_exam" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Create New Exam</h3>
                <Separator />
                <Card>
                  <CardContent className="pt-6">
                    <ExamUpsertForm 
                      handleSubmit={handleCreateExam}
                      isSubmitting={isSubmitting}
                      onSuccess={() => {
                        // Optional: auto-switch tabs after creation
                        document.querySelector('[value="exams_list"]').click();
                      }}
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