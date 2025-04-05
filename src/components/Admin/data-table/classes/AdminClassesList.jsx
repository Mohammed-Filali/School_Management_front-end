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
import ClasseUpsertForm from "../../forms/ClasseUpsertForm";
import { ClasseApi } from "../../../../service/api/student/admins/ClasseApi";
import ClaseCourForm from "../../forms/ClasseCoursForm";
import { ClasseCoursApi } from "../../../../service/api/student/admins/ClasseCoursApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {  Loader2, MoreVertical } from "lucide-react";
import { CourApi } from "../../../../service/api/student/admins/CourApi";
import moment from "moment/moment";








export default function AdminClasseList() {

    const [loading ,setLoading]=useState(true)
    const[data , setData] =useState([])
    const[CoursClass, setCoursClass] =useState([])
    const [cours , srtCours] = useState([])
    useEffect(()=>{
        ClasseApi.all().then(({data})=>{
           setData(data.data)
        })
        CourApi.all().then(({data})=>{
            srtCours(data.data)
         })
        ClasseApi.types()
                     .then(({ data }) => {
                        setLoading(false)
                       const classeTypeCourses = data?.data?.flatMap(item => item.classe_type_course || []); // Combine all classe_type_course arrays
                       if (classeTypeCourses.length > 0) {
                         setCoursClass(classeTypeCourses);
                         // setCours(classeTypeCourses); // Uncomment if using React state
                       } else {
                         console.warn('No classe_type_course found in the response');
                       }
                     })
    },[])


    const AdminClassesColumns =[
        {
            accessorKey:'id',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="#ID" />

              },
        },
        {
            accessorKey :'name',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title=" Name" />

              },
        },
        {
            accessorKey :'class_type_id',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Type Classe" />

              }
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
            const {id,name,class_type_id} = admin

              return <>

<DropdownMenu className="absolute ">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0   relative">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white rounded-md text-center shadow-md w-40 z-50 ">
        <DropdownMenuLabel className="text-gray-700 font-semibold">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator className="border-gray-300" />

        {/* Delete Action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-gray-50 text-left px-4 py-2 text-gray-700 hover:text-red-700 hover:bg-gray-200 rounded-md">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete <span className="font-bold">{name}</span>?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The record will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick ={async()=>{

                    const deletingLoader = toast.loading('Deleting in progress')
                    await ClasseApi.delete(id).then(({status ,message})=>{

                    if(status==201){
                    toast.dismiss(deletingLoader)
                    setData(data.filter((Classe)=>{
                        return Classe.id !=id
                    }));

                    toast.success(message)
                    }else{
                    toast(message)
                    }


                    })

                    }}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog><br/>

        {/* Update Action */}
          <Sheet >
            <SheetTrigger className="w-full">
              <Button className="w-full bg-gray-50 text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-200 rounded-md">Update</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Update Class {name}</SheetTitle>
                <SheetDescription>
                  Make changes to your class here. Click save when you're done.
                </SheetDescription>
                <ClasseUpsertForm
                  handleSubmit={(values) =>
                    ClasseApi.update(values, id).then(() => {
                      setData((prevData) =>
                        prevData.map((classe) =>
                          classe.id === id ? { ...classe, ...values } : classe
                        )
                      );
                      toast.success("Class updated successfully");
                    })
                  }
                  values={{ admin }}
                />
              </SheetHeader>
            </SheetContent>
          </Sheet><br />

        {/* Add Cour Action */}
          <Sheet>
            <SheetTrigger className="w-full">
              <Button className="w-full bg-gray-50 text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md"
              >Add Cour</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Cour to {name}</SheetTitle>
                <SheetDescription>
                  Add a new course to this class. Click save when you're done.
                </SheetDescription>
                <ClaseCourForm
                  handleSubmit={(values) =>
                    ClasseCoursApi.create(values).then(({ status, message }) => {
                      if (status === 201) {
                        toast.success(message);
                      } else {
                        toast.error(message || "Failed to add course");
                      }
                    })
                  }
                  class_id={class_type_id}
                />
              </SheetHeader>
            </SheetContent>
          </Sheet>


          <Sheet>
  <SheetTrigger className="w-full">
    <Button className="w-full bg-gray-50 text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md">
      Cours
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Cours of {name}</SheetTitle>
      <SheetDescription>
        Add a new course to this class. Click save when you're done.
      </SheetDescription>
      {CoursClass && CoursClass.length > 0 ?
        <div
            className="table-responsive w-100"
        >
            <table
                className="table w-100 "
            >
                <thead>
                    <tr>
                        <th scope="col" >Cour</th>
                        <th scope="col">Coef</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        CoursClass.map((v) =>{
                            const cour =cours.find(c=>{
                                return c.id ===v.id
                            })
                            return<><tr key={v.id} className="w-100">

                            <td>{cour&&cour.name}</td>
                            <td>{v.coef}</td>
                            </tr></>}

                          )
                    }


                </tbody>
            </table>
        </div>


       : <div>
        <p>No courses available.</p>
        </div>}
    </SheetHeader>
  </SheetContent>
</Sheet>
      </DropdownMenuContent>
    </DropdownMenu>
                        </>
            },
          },
    ]


    if (loading) return <div><div className="w-full flex items-center justify-center">
  <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
</div></div>;
return<>
    <DataTable columns={AdminClassesColumns} data={data} />
</>

}
