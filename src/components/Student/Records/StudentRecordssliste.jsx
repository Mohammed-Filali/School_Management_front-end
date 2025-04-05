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
} from "@/components/ui/sheet";
import { StudentApi } from "../../../service/api/student/studentApi";
import { UseUserContext } from "../../../context/StudentContext";
import { Loader2 } from "lucide-react";

export default function StudentRecordsList() {
  const { user } = UseUserContext();
  const [data, setData] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
      StudentApi.exams()
        .then(({ data }) => {
            setExams(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch data.");
          setLoading(false);
        });
    }
  }, []);

  useEffect(()=>{
    if(exams.length>0){
        const e = exams.filter(r=> r.classe_id === user.classe_id)
        setData(e)


    }
    console.log(data);
  }, [exams,user])

  const RecordColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#ID" />
      ),
    },

    {
        accessorKey: "Course",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Course" />
        ),
        cell: ({ row }) => {
          const { course } = row.original || {};

          if (!course) return <div>No course available</div>;
          return <>{course.name}</>;
        },
      },

      {
        accessorKey: "Teacher",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Teacher" />
        ),
        cell: ({ row }) => {
          const { teacher } = row.original || {};

          if (!teacher) return <div>No Teacher available</div>;
          return <>{teacher.firsName} {teacher.lastName}</>;
        },
      },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    {
      accessorKey: "Record",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Record" />
      ),
      cell: ({ row }) => {
        const { records } = row.original || {};
        const record = records?.find((r) => r.user_id === user?.id);
        if (!record) return <div>No record available</div>;
        return <>{record.note}</>;
      },
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const { records } = row.original || {};
          const record = records?.find((r) => r.user_id === user?.id);

          return (
            <div className="flex gap-x-1">
              <Sheet>
                <SheetTrigger>
                  <Button size="sm">Detail Records</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Details for {user?.name}</SheetTitle>
                    <SheetDescription>
                      {record ? (
                        <div>
                          <p><strong>Note:</strong> {record.note}</p>
                          <p><strong>Comment:</strong> {record.comment || "N/A"}</p>

                        </div>
                      ) : (
                        <p>No record available for {user.name}.</p>
                      )}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          );
        },
      },

  ];

  if (loading) return <div className="w-full  flex items-center justify-center">
  <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
</div>;
  if (error) return <div>{error}</div>;

  return <DataTable columns={RecordColumns} data={data} />;
}
