import { useEffect, useState } from "react";
import { DataTable } from "../../Admin/data-table/DataTable";
import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";

import { UseUserContext } from "../../../context/StudentContext";
import { Loader2, FileText, BookOpen, Info } from "lucide-react";

export default function StudentMoyennesList() {
  const { user } = UseUserContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(user?.moyennes)
    
  }, []);



useEffect(() => {
  if(data.length > 0){
      setLoading(false);
  }
},[data])

const dataFilter =(e)=> {

  const filter = e.target.value;
  if (filter === "") {
    setData(user?.moyennes);
  } else {
    const filteredData = user?.moyennes.filter((item) =>
      item.course.name.toLowerCase().includes(filter.toLowerCase())
    );
    setData(filteredData);
  }
}

  const RecordColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-600">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "Course",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course" />
      ),
      cell: ({ row }) => {
        const { course } = row.original || {};
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span>{course?.name || "N/A"}</span>
          </div>
        );
      },
    },
    
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Moyenne" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.total}</div>
      ),
    },
  
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-500">Loading your exam records...</p>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 rounded-lg border border-red-200 flex flex-col items-center justify-center space-y-4">
        <Info className="w-10 h-10 text-red-400" />
        <p className="text-red-500">Error loading exam records: {error.message}</p>
      </div>
    );
  }



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Exam Results</h3>
        <div className="text-sm text-gray-500">
          Showing {data.length} {data.length === 1 ? "record" : "records"}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by course..."
            className="border rounded-lg p-2"
            onChange={dataFilter}
          />
          </div>
      </div>
     { data.length==0 ?
      <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-4">
        <FileText className="w-10 h-10 text-gray-400" />
        <p className="text-gray-500">No exam records found for your class.</p>
      </div> :  <DataTable 
        columns={RecordColumns} 
        data={data} 
        className="border rounded-lg overflow-hidden"
      />}
    </div>
  );
}