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
import { TeacherApi } from "../../../../service/api/student/teacherApi";
import TeacherUpsertForm from "../../forms/TeacherUpsertForm";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deleteTeachers_count } from "../../../../redux/admin/adminCountsList";

export default function AdminTeacherList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
const fetchTeachers = async (page = currentPage, per_page = perPage) => {
  try {
    setLoading(true);
    const { data: teachers} =  await TeacherApi.all({
      page,
      per_page,
    });
    setData(teachers.data || []);
    setMeta(teachers.meta);
  } catch (error) {
    toast.error("Failed to load teachers data");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchTeachers();
  }, [currentPage, perPage]);
  const dispatch = useDispatch();

  const handleDelete = async (id, firstName, lastName) => {

    try {
      const { status, message } = await TeacherApi.delete(id);
      dispatch(deleteTeachers_count());
      if (status === 201) {
        setData(data.filter(teacher => teacher.id !== id));
        toast.success("Teacher deleted successfully");
      } else {
        toast.error("Failed to delete teacher");
      }
    } catch (err) {
      toast.error("An error occurred while deleting");
    } 
  };

  const handleUpdate = async (values, id) => {
    try {
      await TeacherApi.update(values, id);
      setData(data.map(teacher => 
        teacher.id === id ? { ...teacher, ...values } : teacher
      ));
      toast.success("Teacher updated successfully");
      return { status: 200, message: "Update successful" };
    } catch (error) {
      toast.error("Failed to update teacher");
      throw error;
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#ID" />
      ),
    },
    {
      accessorKey: 'firsName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
    },
    {
      accessorKey: 'adress',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
    },
    {
      accessorKey: 'blood_Type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Blood Type" />
      ),
    },
    {
      accessorKey: 'date_of_birth',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date of Birth" />
      ),
      cell: ({ row }) => (
        <>{moment(row.getValue("date_of_birth")).format('DD-MM-YYYY')}</>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("gender");
        return <>{value === 'm' ? 'Male' : 'Female'}</>;
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <>{`+212 ${row.getValue("phone")}`}</>,
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => (
        <>{moment(row.getValue("updated_at")).format('DD-MM-YYYY')}</>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const teacher = row.original;
        const { id, firstName, lastName } = teacher;

        return (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {firstName} {lastName}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete 
                    the teacher's account and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDelete(id, firstName, lastName)}
                  >
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm">Edit</Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    Edit {firstName} {lastName}
                  </SheetTitle>
                  <SheetDescription>
                    Update teacher information below
                  </SheetDescription>
                </SheetHeader>
                <TeacherUpsertForm 
                  handleSubmit={(values) => handleUpdate(values, id)}
                  values={teacher}
                />
              </SheetContent>
            </Sheet>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">No teachers found</p>
      </div>
    );
  }

  return <DataTable
      data={data}
      columns={columns}
       meta={meta}
       isLoading={loading}
       onPageChange={(page) => setCurrentPage(page)}
       onPageSizeChange={(size) => setPerPage(size)}
     />;
}