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
import CourUpsertForm from "../../forms/CourUpsertForm";
import { CourApi } from "../../../../service/api/student/admins/CourApi";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminCourList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: response } = await CourApi.all();
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      const deletingLoader = toast.loading(`Deleting ${name}...`);
      const { status, message } = await CourApi.delete(id);
      
      if (status === 201) {
        setData(data.filter((cour) => cour.id !== id));
        toast.success(`Course "${name}" deleted successfully`);
      } else {
        toast.error(message || "Failed to delete course");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
      console.error(error);
    } finally {
      toast.dismiss(deletingLoader);
    }
  };

  const handleUpdate = async (values, id) => {
    try {
      const updatingLoader = toast.loading("Updating course...");
      await CourApi.update(values, id);
      
      setData(data.map(cour => 
        cour.id === id ? { ...cour, ...values } : cour
      ));
      
      toast.success("Course updated successfully");
    } catch (error) {
      toast.error("Failed to update course");
      console.error(error);
    } finally {
      toast.dismiss(updatingLoader);
    }
  };

  const filteredData = data.filter(cour => 
    cour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cour.desc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AdminCourColumns = [
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
      accessorKey: "desc",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-2">
          {row.getValue("desc") || "N/A"}
        </span>
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
        const cour = row.original;
        const { id, name } = cour;

        return (
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Edit Course: {name}</SheetTitle>
                  <SheetDescription>
                    Update the course details below.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <CourUpsertForm 
                    handleSubmit={(values) => handleUpdate(values, id)}
                    values={{ ...cour }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete "{name}"?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the course and all associated data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(id, name)}
                  >
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create New Course</SheetTitle>
              <SheetDescription>
                Fill in the details for the new course.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <CourUpsertForm 
                handleSubmit={async (values) => {
                  setIsCreating(true);
                  try {
                    const { data: newCourse } = await CourApi.create(values);
                    setData([...data, newCourse]);
                    toast.success("Course created successfully");
                  } catch (error) {
                    toast.error("Failed to create course");
                  } finally {
                    setIsCreating(false);
                  }
                }}
                values={null}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <DataTable 
        columns={AdminCourColumns} 
        data={filteredData} 
        emptyMessage="No courses found"
      />
    </div>
  );
}