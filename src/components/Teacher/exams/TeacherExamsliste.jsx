import { useEffect, useState } from "react";
import moment from 'moment'
import { DataTable } from "../../Admin/data-table/DataTable";

import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";
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
import ExamUpsertForm from "./ExamUpsertForm";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import { UseUserContext } from "../../../context/StudentContext";








export default function TeacherExamsList() {
    const[data , setData] =useState([])
    const [isLoading, setIsLoadin]=useState(true)
    const[exams , setExams] =useState([])
    const{user}= UseUserContext()
    useEffect(()=>{
        ExamApi.all().then(({data})=>{
            setIsLoadin(false)
           setData(data.data)
           console.log(data.data);

        }).catch((err)=>{
            console.log(err);
            setIsLoadin(false)
        })
    },[])
    useEffect(()=>{
       if(data.length>0){
        const f =data.filter(e=>{
            return e.teacher_id===user.id
        })
        setExams(f)
       }
    },[data,user])



    const TeacherExamsColumns =[
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
            accessorKey :'classe_id',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Classe" />

              },cell: ({ row }) => {

                const {classe} = row.original
                  const {name} = classe
                return <>{name}</>
              },
      },


        {
            accessorKey :'course_id',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Cour" />

              },cell: ({ row }) => {

                  const {course} = row.original
                    const {name} = course
                  return <>{name}</>
                },
        },
        {
            accessorKey :'type',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Type" />

              },

        },

        {
            accessorKey :'updated_at',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Updated At" />

              },
            cell: ({ row }) => {
                const updated_at = (row.getValue("updated_at"))
                const formated =  moment(new Date(updated_at).toString()).format('d-m-y')
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

                                    await ExamApi.delete(id).then(()=>{

                                        const newdata =exams.filter((e)=>{
                                            return e.id != id
                                        })
                                            setExams(newdata);

                                            toast.success('message')
                                        


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
                              <SheetTitle>Update Exam {name} </SheetTitle>
                              <SheetDescription>
                                Make change to your Exam here . click save if you're done .
                              </SheetDescription>
                                    <ExamUpsertForm handleSubmit={(values) => ExamApi.update(values,id).then(()=>{
                                        const updatedData = data.map(exam => {
                                            if (exam.id === id) {
                                                return { ...exam, ...values }; // Merge the updated values into the Exam object
                                            }
                                            return exam; // Keep the unchanged Exam objects
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

return<>
    <DataTable columns={TeacherExamsColumns} data={exams} isLoading={isLoading} />
</>

}
