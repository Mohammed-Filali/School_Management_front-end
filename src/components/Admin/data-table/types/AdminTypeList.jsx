import { useEffect, useState } from "react";
import { DataTable } from "../DataTable";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClasseApi } from "../../../../service/api/student/admins/ClasseApi";
import { BookOpen, Edit, Loader2, MoreVertical, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import TypeUpsertForm from "../../forms/TypeUpsertForm";
import moment from "moment";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ClaseCourForm from "../../forms/ClasseCoursForm";
import { ClasseCoursApi } from "../../../../service/api/student/admins/ClasseCoursApi";
import { Card, Input } from "antd";

export default function AdminTypeList() {
      const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [coure, setCourse] = useState();
  const fetchTypes = async () => {
    try {
      const { data: response } = await ClasseApi.types();
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch Filiére");
      toast.error("Failed to load Filiére data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [coure]);
  

     

  const handleDelete = async (id) => {
    
    try {
    await ClasseApi.deleteType(id);
      
     
        setData(data.filter(type => type.id !== id));
        toast.success("Filiére deleted successfully");
     
      
    } catch (err) {
      toast.error( "Failed to delete Filiére");

    } 
  };

   const filteredData = data.filter(cour => 
    cour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cour.desc?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleUpdate = async (values, id) => {
    try {
      await ClasseApi.updateType(values, id);
      await fetchTypes(); // Refresh the list after update
      return { status: 200, message: "Update successful" };
    } catch (error) {
      toast.error("Failed to update Filiére");
      throw error;
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#ID" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description");
        return <>{description || "No description"}</>;
      },
        },
        {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const image = row.getValue("image");
        const imageUrl = image 
          ? `${import.meta.env.VITE_BACKEND_URL}/storage/${image}`
          : null;

        return imageUrl ? (
          <img
        src={imageUrl}
        alt="Type"
        className="w-20 h-20 object-cover rounded-md"
          />
        ) : (
          <span className="text-muted-foreground">No image</span>
        );
      },
        },
        {
      accessorKey: "updated_at",
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
        const classe = row.original;
        const { id, name } = classe;
        
        return <>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-md border border-gray-200 dark:bg-gray-800 dark:text-white">
              <DropdownMenuLabel className="text-gray-700 font-semibold px-4 py-2 dark:text-white">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="border-t border-gray-200" />

              {/* Update Action */}
              <Sheet>
          <SheetTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <Edit className="h-4 w-4 text-gray-600 dark:text-white" />
              <span className="text-gray-700 dark:text-white">Update</span>
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
              <TypeUpsertForm 
                handleSubmit={(values) => handleUpdate(values, id)}
                values={classe}
              />
            </div>
          </SheetContent>
              </Sheet>

              {/* Add Course Action */}
              <Sheet>
          <SheetTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <Plus className="h-4 w-4 text-gray-600 dark:text-white" />
              <span className="text-gray-700 dark:text-white">Add Course</span>
            </DropdownMenuItem>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add Course to {name}</SheetTitle>
              <SheetDescription>
                Select a course to add to this class.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <ClaseCourForm
                handleSubmit={async (values) =>{ 
                  try {
                    await ClasseCoursApi.create(values);
                    setCourse(values)
                    toast.success("Course added successfully");
                  } catch (error) {
                    toast.error(error.message || "Failed to add course");

                  }
           }
             
              
                }
                class_id={id}
              />
            </div>
          </SheetContent>
              </Sheet>

              {/* View Courses Action */}
              <Sheet>
          <SheetTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <BookOpen className="h-4 w-4 text-gray-600 dark:text-white" />
              <span className="text-gray-700 dark:text-white">View Courses</span>
            </DropdownMenuItem>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Courses for {name}</SheetTitle>
              <SheetDescription>
                List of courses assigned to this class.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {classe.class_type_courses.length > 0 ? (
                <Card>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Course
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Coefficient
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {classe.class_type_courses.map((v) => {
                                
                                return (
                                  <tr key={v.id}>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      {v.course?.name || "Unknown Course"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      {v.coef}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No courses assigned</p>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <DropdownMenuSeparator />

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
                      This will permanently delete the Filiére and cannot be undone.
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
        </>;
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

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return <><div>
             <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm m-6 dark:bg-gray-800 dark:text-white"
        />
          </div>
          <DataTable columns={columns} data={filteredData} />

          </>
      ;
}