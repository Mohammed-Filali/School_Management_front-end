import { useEffect, useState } from "react";
import moment from 'moment';
import { DataTable } from "../../Admin/data-table/DataTable";
import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import ExamUpsertForm from "./ExamUpsertForm";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import { UseUserContext } from "../../../context/StudentContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeacherExamsList() {
  const [isLoading] = useState(false);
  const { user } = UseUserContext();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");

  // Extract all unique classes from user data
  const teacherClasses = user?.classes?.flatMap(teacherClass => 
    teacherClass.class_type.classe.map(classe => ({
      id: classe.id,
      name: classe.name
    }))
  ) || [];

  useEffect(() => {
    if (user?.exams) {
      const examsWithDetails = user.exams.map(exam => ({
        ...exam,
        classe: teacherClasses.find(c => c.id === exam.classe_id) || null,
        course: user.course || null
      }));
      setExams(examsWithDetails);
      setFilteredExams(examsWithDetails);
    }
  }, [user, teacherClasses]);

  // Apply class filter when selectedClass changes
  useEffect(() => {
    if (selectedClass === "all") {
      setFilteredExams(exams);
    } else {
      setFilteredExams(exams.filter(exam => exam.classe_id.toString() === selectedClass));
    }
  }, [selectedClass, exams]);

  const handleDelete = async (id, name) => {
    try {
      await ExamApi.delete(id);
      setExams(prev => prev.filter(e => e.id !== id));
      setFilteredExams(prev => prev.filter(e => e.id !== id));
      toast.success(`Exam "${name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error("Failed to delete exam");
    }
  };

  const handleUpdate = async (values, id) => {
    try {
      await ExamApi.update(id, values);
      setExams(prev => prev.map(exam => 
        exam.id === id ? { ...exam, ...values } : exam
      ));
      toast.success("Exam updated successfully");
    } catch (error) {
      console.error("Error updating exam:", error);
      toast.error("Failed to update exam");
    }
  };

  const TeacherExamsColumns = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">#{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: 'classe_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }) => {
        const { classe } = row.original;
        return <span>{classe?.name || '-'}</span>;
      },
    },
    {
      accessorKey: 'course_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course" />
      ),
      cell: ({ row }) => {
        const { course } = row.original;
        return <span>{course?.name || '-'}</span>;
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
      cell: ({ row }) => {
        const updatedAt = row.getValue("updated_at");
        return (
          <span className="text-muted-foreground">
            {moment(updatedAt).format('MMM D, YYYY')}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const exam = row.original;
        const { id, name } = exam;

        return (
          <div className="flex space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader className="mb-6">
                  <SheetTitle>Update Exam</SheetTitle>
                  <SheetDescription>
                    Make changes to {name}. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <ExamUpsertForm 
                  handleSubmit={(values) => handleUpdate(values, id)}
                  values={exam}
                />
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the exam and all its data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDelete(id, name)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-background p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Exams</h2>
        <div className="w-64">
          <Select 
            value={selectedClass}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {teacherClasses.map(classe => (
                <SelectItem key={classe.id} value={classe.id.toString()}>
                  {classe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DataTable 
        columns={TeacherExamsColumns} 
        data={filteredExams} 
        isLoading={isLoading}
        emptyMessage="No exams found"
      />
    </div>
  );
}