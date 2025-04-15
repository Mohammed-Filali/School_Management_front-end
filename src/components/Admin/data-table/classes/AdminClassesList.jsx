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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Trash2, Edit, BookOpen, Plus } from "lucide-react";
import ClasseUpsertForm from "../../forms/ClasseUpsertForm";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { ClasseApi } from "../../../../service/api/student/admins/ClasseApi";

export default function AdminClasseList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, coursResponse, typesResponse] = await Promise.all([
          ClasseApi.all(),
      
        ]);

        setData(classesResponse.data.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      const deletingLoader = toast.loading(`Deleting ${name}...`);
      const { status, message } = await ClasseApi.delete(id);

      if (status === 201) {
        setData(data.filter(classe => classe.id !== id));
        toast.success(`Class "${name}" deleted successfully`);
      } else {
        toast.error(message || "Failed to delete class");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
      console.error(error);
    } finally {
      toast.dismiss(deletingLoader);
    }
  };

  const AdminClassesColumns = [
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
        <DataTableColumnHeader column={column} title="Class Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "class_type_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const typeId = row.getValue("class_type_id");
        const typeName = typeId === 1 ? "Primary" : typeId === 2 ? "Secondary" : "Unknown";
        return <Badge variant="secondary">{typeName}</Badge>;
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
        const classe = row.original;
        const { id, name } = classe;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

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
                    <SheetTitle>Update Class</SheetTitle>
                    <SheetDescription>
                      Make changes to {name} here.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <ClasseUpsertForm
                      handleSubmit={(values) => {
                        return ClasseApi.update(values, id).then(() => {
                          setData(data.map(c => 
                            c.id === id ? { ...c, ...values } : c
                          ));
                          toast.success("Class updated successfully");
                        });
                      }}
                      values={classe}
                    />
                  </div>
                </SheetContent>
              </Sheet>

             

              <DropdownMenuSeparator />

              {/* Delete Action */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
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
                      This will permanently delete the class and cannot be undone.
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
        columns={AdminClassesColumns} 
        data={data} 
        emptyMessage="No classes found"
      />
    </div>
  );
}