


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

import StudentUpsertForm from "../../forms/StudentUpsertForm";
import { Loader2, Trash2Icon } from "lucide-react";
import { AdminApi } from "../../../../service/api/student/admins/adminApi";
import moment from "moment/moment";








export default function AdminStudentList({classe_id}) {
    const[data , setData] =useState([])
    const [loading , setLoading]=useState(true)
    const [sudents, setStudnets]= useState([])
    useEffect(()=>{
        AdminApi.allsStudents().then(({data})=>{

            setLoading(false)
           setData(data)
        })
    },[])

    useEffect(()=>{
        const student= data.filter((s)=>{
            return s.classe_id === classe_id
        })
        setStudnets(student)

    },[data,classe_id])


    const studentColumns = [
        {
          accessorKey: "id",
          header: ({column}) => {
            return <DataTableColumnHeader column={column} title="#ID"/>
          },
        },
        {
          accessorKey: "name",
          header: ({column}) => {
            return <DataTableColumnHeader column={column} title="Firstname"/>
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
          accessorKey: "email",
          header: ({column}) => {
            return <DataTableColumnHeader column={column} title="Email"/>
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
          accessorKey: "updated_at",
          header: ({column}) => {
            return <DataTableColumnHeader column={column} title="Updated at"/>
          },
          cell: ({row}) => {
            const date = (row.getValue("updated_at"))
            const formated =  moment(new Date(date).toString()).format('d-m-y')

            return <div className="text-right font-medium">{formated}</div>
          },
        },
        {
          id: "actions",
          cell: ({row}) => {
            const {id, name} = row.original
            const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
            return (<div className={'flex gap-x-1'}>
                <Sheet open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
                  <SheetTrigger>
                    <Button size={'sm'}>Update</Button>
                  </SheetTrigger>
                  <SheetContent  className='overflow-y-auto p-4'>
                  <SheetHeader>
                      <SheetTitle>Update student {name}</SheetTitle>
                      <SheetDescription>
                        Make changes to your student here. Click save when you're done.
                        <StudentUpsertForm values={row.original} handleSubmit={(values) => {
                          const promise = AdminApi.updateStudent(id, values)
                          promise.then((response) => {
                            const {student} = response.data
                            const elements = data.map((item) => {
                              if(item.id === id) {
                                return student
                              }
                              return item
                            })
                            setData(elements)
                            setOpenUpdateDialog(false);
                          });

                          return promise
                        }}/>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={'sm'} variant={'destructive'}>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure to delete
                        <span className={'font-bold'}>{name}</span> ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={async () => {
                        const deletingLoader = toast.loading('Deleting in progress.')
                        const {data: deletedStudent, status} = await AdminApi.deleteStudent(id)
                        toast.dismiss(deletingLoader)
                        if (status === 200) {
                          setData(data.filter((student) => student.id !== id))
                          toast.success('Student deleted', {
                            description: `Student deleted successfully ${deletedStudent.data.firstname} ${deletedStudent.data.lastname}`,
                            icon: <Trash2Icon/>
                          })
                        }
                      }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )
          },
        },
      ]

      if (loading) return <div><div className="w-full  flex items-center justify-center">
  <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
</div></div>;

return<>
    <DataTable columns={studentColumns} data={sudents} />
</>

}
