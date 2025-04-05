import { useEffect, useState } from "react";

import { DataTable } from "../DataTable";
import { ParentApi } from "../../../../service/api/student/admins/parenpApi";

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
import ParentUpsertForm from "../../forms/ParentUpsertForm";
import { Loader2 } from "lucide-react";
import moment from "moment/moment";








export default function AdminParentList() {
    const[data , setData] =useState([])
    const [loading , setLoading]=useState(true)
    useEffect(()=>{
        ParentApi.all().then(({data})=>{
            setLoading(false)
           setData(data)
        })
    },[])


    const AdminParentColumns =[
        {
            accessorKey:'id',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="#ID" />

              },
        },
        {
            accessorKey :'firsName',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="First Name" />

              },
        },
        {
            accessorKey :'lastName',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Last Name" />

              },
        },
        {
            accessorKey :'adress',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Address" />

              },
        },
        {
            accessorKey :'blood_Type',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Bood Type" />

              },
        },
        {
            accessorKey :'date_of_birth',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Date Of Birth" />

              },
        },
        {
            accessorKey :'email',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Email" />

              },
        },
        {
            accessorKey :'gender',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Gender" />

              },
            cell: ({ row }) => {
                const value = (row.getValue("gender"))
                const gender = value ==='m' ? 'male':'femal';
                return <>{gender}</>
              },
        },
        {
            accessorKey :'phone',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Phone" />

              },
            cell: ({ row }) => {
                const phone = (row.getValue("phone"))

                return <>+212 {phone}</>
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
            const {id,firsName,lastName} = admin
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
                                     <span className="front-bold"> {firsName} {lastName} </span> ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick ={async()=>{

                                            const deletingLoader = toast.loading('Deleting in progress')
                                    await ParentApi.delete(id).then(({status ,message})=>{

                                        if(status==201){
                                            toast.dismiss(deletingLoader)
                                            setData(data.filter((parent)=>{
                                                return parent.id !=id
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
                          <Sheet >
                          <SheetTrigger>
                            <Button size={'sm'}>
                                Update
                            </Button>
                          </SheetTrigger>
                          <SheetContent  className='overflow-y-auto p-4'>
                            <SheetHeader>
                              <SheetTitle>Update Parent {firsName} {lastName} </SheetTitle>
                              <SheetDescription>
                                Make change to your parent here . click save if you're done .
                              </SheetDescription>
                                    <ParentUpsertForm handleSubmit={(values) => ParentApi.update(values,id).then(()=>{
                                        const updatedData = data.map(parent => {
                                            if (parent.id === id) {
                                                return { ...parent, ...values }; // Merge the updated values into the parent object
                                            }
                                            return parent; // Keep the unchanged parent objects
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
    <DataTable columns={AdminParentColumns} data={data} />
</>

}
