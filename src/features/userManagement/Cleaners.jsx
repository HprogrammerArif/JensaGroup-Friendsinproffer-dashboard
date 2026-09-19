import { useMemo, useState } from "react";
import MiniAdminHeader from "./components/MiniAdminHeader";
import CleanersTable from "./components/CleanersTable";
import AddMiniAdminModal from "./components/AddMiniAdminModal";
import {
  useUserCleanerFilterQuery,
  useCreateUsermanagementDataMutation,
  useUpdateUsermanagementDataMutation,
  useDeleteUsermanagementDataMutation,
} from "../../Redux/feature/baseApi";
import { toast } from "react-toastify";

const Cleaners = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data: showUserCleanerData, isLoading } = useUserCleanerFilterQuery("cleaner");
  const [createUser] = useCreateUsermanagementDataMutation();
  const [updateUser] = useUpdateUsermanagementDataMutation();
  const [deleteUser] = useDeleteUsermanagementDataMutation();

  const cleaners = showUserCleanerData?.results || [];

  const filteredCleaners = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return cleaners;
    return cleaners.filter((cleaner) =>
      [
        cleaner.member_no,
        cleaner.user_profile?.full_name,
        cleaner.phone_or_email,
        ...(cleaner.assined_area_data?.map((a) => a.name) || []),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [search, cleaners]);

  // Open add modal
  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Open edit modal pre-filled
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const getErrorMessage = (error, defaultMsg) => {
    const data = error?.data;
    if (!data) return error?.message || defaultMsg;
    if (typeof data === "string") return data;
    if (Array.isArray(data?.error) && data.error.length > 0) return data.error[0];
    if (typeof data?.error === "string") return data.error;
    if (data?.message) return data.message;
    if (data?.detail) return data.detail;
    if (typeof data === "object") {
      const firstVal = Object.values(data).flat()[0];
      if (typeof firstVal === "string") return firstVal;
    }
    return defaultMsg;
  };

  // Delete by id
  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("Cleaner deleted successfully!");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete cleaner."));
    }
  };

  // Create or update
  const handleSubmit = async (payload, id) => {
    try {
      if (id) {
        await updateUser({ id, data: payload }).unwrap();
        toast.success("Cleaner updated successfully!");
      } else {
        await createUser(payload).unwrap();
        toast.success("Cleaner added successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Operation failed."));
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <MiniAdminHeader
        search={search}
        onSearch={setSearch}
        onCreate={handleOpenAdd}
        subtitle="Manage your cleaners & staff"
        listTitle="All Cleaners list"
        buttonLabel="Add Cleaner"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <p>Loading cleaners...</p>
        </div>
      ) : (
        <CleanersTable
          cleaners={filteredCleaners}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddMiniAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editUser={editingUser}
        title={editingUser ? "Edit Cleaner" : "Add New Cleaner"}
        submitLabel={editingUser ? "Update Cleaner" : "Add Cleaner"}
        role="cleaner"
      />
    </main>
  );
};

export default Cleaners;
