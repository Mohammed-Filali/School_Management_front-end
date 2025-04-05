

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

// import AdminParentList from "../data-table/AdminParentList.jsx";
import { Tabs ,TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";
import { UseUserContext } from "../../../context/StudentContext.jsx";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ParentUpsertForm from "../forms/ParentUpsertForm.jsx";
import { ParentApi } from "../../../service/api/student/admins/parenpApi.js";
import AdminParentList from "../data-table/parent/AdminParentList.jsx";

export default function ManageParents() {
    const { user } = UseUserContext();

    return (
      <>
        <div className="relative overflow-x-auto w-full">
          <div className="hidden md:block">
            <div className="bg-background">
              <div className="grid">
                <div className="col-span-3 lg:col-span-4">
                  <div className="h-full px-4 py-6 lg:px-8">
                    {/* Change w-[500px] to w-full to make it take the full width */}
                    <Tabs defaultValue="parents_list" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="parents_list">Parents</TabsTrigger>
                        <TabsTrigger value="add_parent">Add new parent</TabsTrigger>
                      </TabsList>

                      <TabsContent value="parents_list" className="border-none p-0 outline-none">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 w-full">
                            <h2 className="text-2xl font-semibold tracking-tight w-full">
                              All parents
                            </h2>
                            <AdminParentList />
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="relative">
                          <ScrollArea>
                            <div className="flex space-x-4 pb-4"></div>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      </TabsContent>

                      <TabsContent value="add_parent">
                        <div className="space-y-1">
                          <ParentUpsertForm handleSubmit={(values) => ParentApi.create(values)}  />
                        </div>
                        <Separator className="my-4" />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
