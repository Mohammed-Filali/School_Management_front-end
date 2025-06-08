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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger, // Make sure this is imported
} from "@/components/ui/sheet";
import ParentUpsertForm from "../../forms/ParentUpsertForm";
import { Loader2, Trash2, Edit, MoreHorizontal } from "lucide-react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AxiosClient } from "../../../../api/axios";

export default function AdminParentList() {
   const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);






  const fetchParents = async (page = currentPage, per_page = perPage) => {
  try {
    setLoading(true);
    const { data: parents, meta: parentMeta } =  await ParentApi.all({
      page,
      per_page,
    });
    console.log(parents);
    
    setData(parents || []);
    setMeta(parentMeta);
  } catch (error) {
    console.error("Error fetching parents:", error);
    toast.error("Failed to load parent data");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchParents();
  }, [currentPage, perPage]);

  const handleDelete = async (id, firstName, lastName) => {
    try {
      const { status, message } = await ParentApi.delete(id);

      if (status === 201) {
        setData(data.filter(parent => parent.id !== id));
        toast.success(`Parent ${firstName} ${lastName} deleted successfully`);
      } else {
        toast.error(message || "Failed to delete parent");
      }
    } catch (error) {
      console.error("Error deleting parent:", error);
      toast.error("An error occurred while deleting");
    } 
  };

  const AdminParentColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("id")}
        </Badge>
      ),
      size: 80,
    },
    {
      accessorKey: "firsName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <a 
          href={`mailto:${row.getValue("email")}`} 
          className="text-blue-600 hover:underline"
        >
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <a 
          href={`tel:+212${row.getValue("phone")}`}
          className="text-blue-600 hover:underline"
        >
          +212 {row.getValue("phone")}
        </a>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("gender");
        const gender = value === 'm' ? 'Male' : 'Female';
        return (
          <Badge variant={value === 'm' ? 'default' : 'secondary'}>
            {gender}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("updated_at");
        return (
          <div className="flex flex-col">
            <span>{moment(date).format("MMM D, YYYY")}</span>
            <span className="text-xs text-muted-foreground">
              {moment(date).fromNow()}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const parent = row.original;
        const { id, firsName, lastName } = parent;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Update Action */}
              <Sheet>
                <SheetTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                  </DropdownMenuItem>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>
                      Update {firsName} {lastName}
                    </SheetTitle>
                    <SheetDescription>
                      Make changes to this parent record
                    </SheetDescription>
                  </SheetHeader>
                  <ParentUpsertForm
                    handleSubmit={(values) =>
                      ParentApi.update(values, id).then(() => {
                        setData(data.map(p => 
                          p.id === id ? { ...p, ...values } : p
                        ));
                        toast.success("Parent updated successfully");
                      })
                    }
                    values={{ ...parent }}
                  />
                </SheetContent>
              </Sheet>

              {/* Delete Action */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {firsName} {lastName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this parent record and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(id, firsName, lastName)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
    <DataTable
      data={data}
      columns={AdminParentColumns}
       meta={meta}
       isLoading={loading}
       onPageChange={(page) => setCurrentPage(page)}
       onPageSizeChange={(size) => setPerPage(size)}
     />
   </div>
  );
}