import { useEffect, useState } from "react";
import { DataTable } from "../DataTable";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
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
import StudentUpsertForm from "../../forms/StudentUpsertForm";
import { Loader2, Trash2, Edit, MoreHorizontal } from "lucide-react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminApi } from "../../../../service/api/student/admins/adminApi";

export default function AdminStudentList({ classe_id }) {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data: response } = await AdminApi.allsStudents();
        setData(response || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (classe_id) {
      const filteredStudents = data.filter(student => student.classe_id === classe_id);
      setStudents(filteredStudents);
    } else {
      setStudents(data);
    }
  }, [data, classe_id]);

  const handleDelete = async (id, name) => {
    try {
      const deletingLoader = toast.loading(`Deleting ${name}...`);
      const { status, data: response } = await AdminApi.deleteStudent(id);

      if (status === 200) {
        setData(data.filter(student => student.id !== id));
        toast.success(`Student ${name} deleted successfully`, {
          description: `Student ${response.data.firstname} ${response.data.lastname} removed`,
          icon: <Trash2 className="h-5 w-5" />
        });
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    } finally {
      toast.dismiss(deletingLoader);
    }
  };

  const studentColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("id")}
        </Badge>
      ),
      size: 80,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <a 
          href={`mailto:${row.getValue("email")}`} 
          className="text-blue-600 hover:underline"
        >
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <a 
          href={`tel:+212${row.getValue("phone")}`}
          className="text-blue-600 hover:underline"
        >
          +212 {row.getValue("phone")}
        </a>
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
          <Badge variant={value === 'm' ? 'default' : 'secondary'}>
            {value === 'm' ? 'Male' : 'Female'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("updated_at");
        return (
          <div className="flex flex-col">
            <span>{moment(date).format("MMM D, YYYY")}</span>
            <span className="text-xs text-muted-foreground">
              {moment(date).fromNow()}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        const { id, name } = student;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Update Action */}
              <Sheet>
                <SheetTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                  </DropdownMenuItem>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Update {name}</SheetTitle>
                    <SheetDescription>
                      Make changes to this student's record
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <StudentUpsertForm
                      values={student}
                      handleSubmit={(values) => 
                        AdminApi.updateStudent(id, values).then((response) => {
                          setData(data.map(s => 
                            s.id === id ? response.data.student : s
                          ));
                          toast.success("Student updated successfully");
                        })
                      }
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Delete Action */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this student record and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(id, name)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable 
        columns={studentColumns} 
        data={students} 
        emptyMessage="No students found"
      />
    </div>
  );
}