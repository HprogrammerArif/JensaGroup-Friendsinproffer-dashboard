import { useMemo, useState } from "react";
import MiniAdminHeader from "./components/MiniAdminHeader";
import MiniAdminTable from "./components/MiniAdminTable";
import AddMiniAdminModal from "./components/AddMiniAdminModal";
import {
  useUserMiniAdminFilterQuery,
  useCreateUsermanagementDataMutation,
  useUpdateUsermanagementDataMutation,
  useDeleteUsermanagementDataMutation,
} from "../../Redux/feature/baseApi";
import { toast } from "react-toastify";

const MiniAdmin = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data: showUserMiniAdminData, isLoading } = useUserMiniAdminFilterQuery("mini_admin");
  const [createUser] = useCreateUsermanagementDataMutation();
  const [updateUser] = useUpdateUsermanagementDataMutation();
  const [deleteUser] = useDeleteUsermanagementDataMutation();

  const admins = showUserMiniAdminData?.results || [];

  const filteredAdmins = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return admins;
    return admins.filter((admin) =>
      [
        admin.member_no,
        admin.user_profile?.full_name,
        admin.phone_or_email,
        ...(admin.assined_area_data?.map((a) => a.name) || []),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [search, admins]);

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
      toast.success("Mini admin deleted successfully!");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete mini admin."));
    }
  };

  // Create or update
  const handleSubmit = async (payload, id) => {
    try {
      if (id) {
        await updateUser({ id, data: payload }).unwrap();
        toast.success("Mini admin updated successfully!");
      } else {
        await createUser(payload).unwrap();
        toast.success("Mini admin added successfully!");
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
        subtitle="Manage your mini admins & staff"
        listTitle="All Mini Admin list"
        buttonLabel="New Mini Admin"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <p>Loading mini admins...</p>
        </div>
      ) : (
        <MiniAdminTable
          admins={filteredAdmins}
          emptyLabel="mini admins"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddMiniAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editUser={editingUser}
        title={editingUser ? "Edit Mini Admin" : "Add New Mini Admin"}
        submitLabel={editingUser ? "Update Admin" : "Add Admin"}
        role="mini_admin"
      />
    </main>
  );
};

export default MiniAdmin;
