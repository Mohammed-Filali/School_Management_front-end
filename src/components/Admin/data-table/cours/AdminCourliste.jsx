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
  } from "@/components/ui/alert-dialog"
  import { toast } from "sonner"


  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import CourUpsertForm from "../../forms/CourUpsertForm";
import { CourApi } from "../../../../service/api/student/admins/CourApi";
import { Loader2 } from "lucide-react";
import moment from "moment/moment";








export default function AdminCourList() {
    const[data , setData] =useState([])
    const [loading , setLoading]=useState(true)
    useEffect(()=>{
        CourApi.all().then(({data})=>{
            setLoading(false)
           setData(data.data)
        })
    },[])


    const AdminCourColumns =[
        {
            accessorKey:'id',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="#ID" />

              },
        },
        {
            accessorKey :'name',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Name" />

              },
        },
        {
            accessorKey :'desc',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Description" />

              },
        },

        {
            accessorKey :'updated_at',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Updated At" />

              },
            cell: ({ row }) => {
                const date = (row.getValue("updated_at"))
                const formated =  moment(new Date(date).toString()).format('d-m-y')
                return <>{formated}</>
              },
        },
        {
            id: "actions",
            cell: ({ row }) => {
            const admin = row.original
            const {id,name} = admin
            console.log(id);


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
                                    await CourApi.delete(id).then(({status ,message})=>{

                                        if(status==201){
                                            toast.dismiss(deletingLoader)
                                            setData(data.filter((Cour)=>{
                                                return Cour.id !=id
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
                            <Button size={'sm'}>
                                Update
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Update Cour {name} </SheetTitle>
                              <SheetDescription>
                                Make change to your Cour here . click save if you're done .
                              </SheetDescription>
                                    <CourUpsertForm handleSubmit={(values) => CourApi.update(values,id).then(()=>{
                                        const updatedData = data.map(cour => {
                                            if (cour.id === id) {
                                                return { ...cour, ...values }; // Merge the updated values into the Cour object
                                            }
                                            return cour; // Keep the unchanged Cour objects
                                        });
                                        setData(updatedData)
                                    })

                                    } values={{...admin}} />

                            </SheetHeader>
                          </SheetContent>
                        </Sheet>

                        </div>
                        </>
            },
          },
    ]


    if (loading) return <div><div className="w-full  flex items-center justify-center">
  <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
</div></div>;

return<>
    <DataTable columns={AdminCourColumns} data={data} />
</>

}
