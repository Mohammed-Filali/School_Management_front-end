import { useEffect, useState } from "react";

import { DataTable } from "../../Admin/data-table/DataTable";

import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";



  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { ClassTeacherApi } from "../../../service/api/student/teachers/classApi";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import RecordsUpsertForm from "./RecordsUpsertForm";
import moment from "moment";








export default function TeacherRecordsList({id}) {
    const[data , setData] =useState([])
    const [isLoading, setIsLoadin]=useState(true)
    const [students,setStudents]=useState([])
    useEffect(()=>{
        if(data.length===0){
        ClassTeacherApi.students().then(({data})=>{
            setIsLoadin(false)
           setData(data.data)
        }).catch((err)=>{
            console.log(err);
            setIsLoadin(false)
        })
        }


    },[])

    useEffect(() => {
        if (data.length > 0) {
            const matchedClasses = data.filter((s) => s.classe_id === id);
            setStudents(matchedClasses); // Always an array of matched classes
        }
    }, [data, id]); // Depend on both `data` and `id`



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
            return (<div className={'flex gap-x-1'}>
                <Sheet>
                                          <SheetTrigger>
                                            <Button size={'sm'}>
                                                Add Records
                                            </Button>
                                          </SheetTrigger>
                                          <SheetContent>
                                            <SheetHeader>
                                              <SheetTitle>Add Record To {name} </SheetTitle>
                                              <SheetDescription>
                                                Make change to your Exam here . click save if you're done .
                                              </SheetDescription>
                                                    <RecordsUpsertForm handleSubmit={(values) => ExamApi.createRecord(values)}  user_id={id}/>

                                            </SheetHeader>
                                          </SheetContent>
                                        </Sheet>

              </div>
            )
          },
        },
      ]

return<>
    <DataTable columns={studentColumns} data={students} isLoading={isLoading} />
</>

}
