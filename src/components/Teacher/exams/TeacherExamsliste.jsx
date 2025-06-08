import React, { useEffect, useState, useCallback, useMemo } from "react";
import moment from "moment";
import { UseUserContext } from "../../../context/StudentContext";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ExamUpsertForm from "./ExamUpsertForm";
import { useDispatch } from "react-redux";
import { setExams } from "../../../redux/Teacher/ExamsSlice";

export default function TeacherExamsList({ exams }) {
  const { user } = UseUserContext();
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
const dispatch = useDispatch(); // Assuming you have set up Redux and useDispatch
  // Handle new exam addition
  

  // Memoize teacher classes
  const teacherClasses = useMemo(() => (
    user?.classes?.flatMap(tc =>
      tc.class_type?.classe?.map(c => ({ id: c.id, name: c.name })) || []
    ) || []
  ), [user]);

  // Fetch exams
  const fetchExams = useCallback(async () => {
    try {
      setIsLoading(true);
      if (exams) {
        
        dispatch(setExams(exams)); // Dispatch the exams to Redux store
        setFilteredExams(exams);
      }
    } catch (error) {
      console.error("Error loading exams:", error);
      toast.error("Failed to load exams");
    } finally {
      setIsLoading(false);
    }
  }, [exams, teacherClasses]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Filter exams by class
  useEffect(() => {
    setFilteredExams(
      selectedClass === "all"
        ? exams
        : exams.filter(exam => exam.classe_id?.toString() === selectedClass)
    );
  }, [selectedClass, exams]);

  const handleDelete = async (id, name) => {
    try {
      setIsLoading(true);
      await ExamApi.delete(id);
      setExams(prev => prev.filter(e => e.id !== id));
      toast.success(`Exam "${name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error("Failed to delete exam");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values, id) => {
    try {
      setIsLoading(true);
      await ExamApi.update(id, values);
      setExams(prev => prev.map(e => e.id === id ? { ...e, ...values } : e));
      toast.success("Exam updated successfully");
    } catch (error) {
      console.error("Error updating exam:", error);
      toast.error("Failed to update exam");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <span className="text-muted-foreground">#{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "classe_id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
      cell: ({ row }) => teacherClasses.find(tc => tc.id === row.getValue("classe_id"))?.name || "-",
    },
    
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
      cell: ({ row }) => moment(row.getValue("updated_at")).format("MMM D, YYYY"),
    },
    {
      id: "actions",
      cell: ({ row }) => <ExamActions exam={row.original} onDelete={handleDelete} onUpdate={handleUpdate} />,
    },
  ], []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-md border bg-background p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Exams</h2>
        <div className="w-64">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {teacherClasses.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredExams}
        isLoading={isLoading}
        emptyMessage="No exams found"
      />
    </div>
  );
}

const ExamActions = React.memo(({ exam, onUpdate, onDelete }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetTrigger asChild>
          <Button size="sm" variant="outline">Edit</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit {exam.name}</SheetTitle>
            <SheetDescription>Update the exam details below.</SheetDescription>
          </SheetHeader>
          <ExamUpsertForm
            handleSubmit={(values) => {
              onUpdate(values, exam.id);
              setEditOpen(false);
            }}
            values={exam}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{exam.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                onDelete(exam.id, exam.name);
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});