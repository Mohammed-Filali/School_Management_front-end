import { useEffect, useState } from "react";
import moment from "moment";
import { DataTable } from "../../Admin/data-table/DataTable";
import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import RecordsUpsertForm from "./RecordsUpsertForm";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { UseUserContext } from "../../../context/StudentContext";

export default function TeacherRecordsList({ id }) {
  const { user } = UseUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (user && user.classes) {
      // Flatten all students from all classes
      const allStudents = user.classes.flatMap(classe => 
        classe.class_type?.classe?.flatMap(c => 
          c.students?.map(student => ({
            ...student,
            classe_id: c.id,
            classe_name: c.name
          })) || []
        ) || []
      );
      
      // If a specific class ID is provided, filter students for that class
      const filteredStudents = id 
        ? allStudents.filter(student => student.classe_id === id)
        : allStudents;

      setStudents(filteredStudents);
      setIsLoading(false);
    }
  }, [user, id]);

  const handleAddRecord = (student) => {
    setSelectedStudent(student);
    setSheetOpen(true);
  };

  const handleSubmitRecord = async (values) => {
    try {
      await ExamApi.createRecord(values);
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const studentColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">#{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("gender");
        return (
          <Badge variant="outline" className="capitalize">
            {value === 'm' ? 'Male' : 'Female'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Birth Date" />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("date_of_birth");
        return dob ? moment(dob).format('MMM D, YYYY') : '-';
      },
    },
    {
      accessorKey: "blood_Type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Blood Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="destructive">
          {row.getValue("blood_Type") || 'Unknown'}
        </Badge>
      ),
    },
    {
      accessorKey: "classe_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("updated_at");
        return (
          <span className="text-muted-foreground">
            {moment(date).format('MMM D, YYYY')}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddRecord(student)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
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
    <div className="space-y-4">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>
              Add Record for {selectedStudent?.name}
            </SheetTitle>
            <SheetDescription>
              Enter the record details below
            </SheetDescription>
          </SheetHeader>
          <RecordsUpsertForm 
            user_id={selectedStudent?.id}
            handleSubmit={handleSubmitRecord}
            onSuccess={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <DataTable 
        columns={studentColumns} 
        data={students} 
        isLoading={isLoading}
        emptyMessage="No students found in this class"
      />
    </div>
  );
}