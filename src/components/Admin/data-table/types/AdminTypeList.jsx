import { useEffect, useState } from "react";
import { DataTable } from "../DataTable";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClasseApi } from "../../../../service/api/student/admins/ClasseApi";
import { Loader2 } from "lucide-react";
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
  } from "@/components/ui/alert-dialog"
import TypeUpsertForm from "../../forms/TypeUpsertForm";
import moment from "moment";

export default function AdminTypeList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const[formData , setFormData] = useState({})

  useEffect(() => {
    setLoading(true);
    ClasseApi.types()
      .then(({ data }) => {
        setData(data.data); // Ensure you're handling the data properly
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch classes.");
        setLoading(false);
      });
  }, [formData]);



  const AdminClassesColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="#ID" />;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Name" />;
      },
    },
    {
      accessorKey: "code",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Code" />;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Description" />;
      },
      cell: ({ row }) => {
        const description = row.getValue("description");
        return <>{description ? description : "No description"}</>;
      },
    },
    {
        accessorKey: "image",
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title="Image" />;
        },
        cell: ({ row }) => {
          const image = row.getValue("image");

          // Construct the image URL only if the image exists
          const imageUrl = image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${image}` : null;

          return imageUrl ? (
            <img
              src={imageUrl}
              alt="Class Image"
              className="w-20 h-20 object-cover"
            />
          ) : (
            <span>No image</span>
          );
        },
      }
,

    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Updated At" />;
      },
      cell: ({ row }) => {
        const date = row.getValue("updated_at");
        const formated =  moment(new Date(date).toString()).format('d-m-y')
        return <>{formated}</>;
      },
    },

    {
                id: "actions",
                cell: ({ row }) => {
                const admin = row.original
                const {id , name} = admin


                  return <>
                        <div className="flex gap-x-1">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant={'destructive'} size={'sm'}>Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure to delete
                                         <span className="front-bold"> {name} </span> ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete your account
                                      and remove your data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick ={async()=>{

                                                const deletingLoader = toast.loading('Deleting in progress')
                                        await ClasseApi.deleteType(id).then(({status ,message})=>{

                                            if(status==200){
                                                toast.dismiss(deletingLoader)
                                                setData(data.filter((teacher)=>{
                                                    return teacher.id != id
                                                }));

                                                toast.success(message)
                                            }else{
                                                toast(message)
                                            }


                                         })

                                    }}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Sheet>
          <SheetTrigger>
            <Button size="sm">Update</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Update {admin.name}</SheetTitle>
              <SheetDescription>
                Make changes to the class here. Click save when you're done.
              </SheetDescription>
              <TypeUpsertForm
                handleSubmit={(values) => {

                    ClasseApi.updateType(values, id).then(() => {
                         setFormData(Object.fromEntries(values.entries()))

                        console.log("Form Values before submitting:", formData); // Log form values to debug

                      const updatedData = data.map((teacher) => {
                        if (teacher.id === id) {
                          return { ...teacher, ...formData }; // Merge updated values into the teacher object
                        }
                        return teacher; // Keep the unchanged teacher objects
                      });
                      setData(updatedData);
                    }).catch((error) => {
                      console.log("Error during update:", error); // Log any errors for debugging
                    });
                  }}

                values={admin} // Pass the correct values from admin
              />
            </SheetHeader>
          </SheetContent>
        </Sheet>

                            </div>
                            </>
                },
              },
  ];

  if (loading)
    return (
      <div>
        <div className="w-full flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      </div>
    );

  return <DataTable columns={AdminClassesColumns} data={data} />;
}
