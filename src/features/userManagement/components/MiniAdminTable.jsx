import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiMoreVertical, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { useToggleUserActiveMutation } from "../../../Redux/feature/baseApi";
import { toast } from "react-toastify";

const StatusBadge = ({ isActive }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      Inactive
    </span>
  );

const RoleBadge = ({ role }) => {
  const map = {
    cleaner: "bg-green-50 text-green-700 border-green-200",
    maintainer: "bg-orange-50 text-orange-700 border-orange-200",
    mini_admin: "bg-blue-50 text-blue-700 border-blue-200",
    admin: "bg-purple-50 text-purple-700 border-purple-200",
  };
  const cls = map[role] || "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}
    >
      {role ? role.replace("_", " ") : "—"}
    </span>
  );
};

const ActionMenu = ({ user, onEdit, onDelete, onToggleActive }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-slate-100"
        aria-label="Open actions"
      >
        <FiMoreVertical />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(user); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <FiEdit2 className="text-base" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onToggleActive(user.id, user.is_active); }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition ${
              user.is_active
                ? "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                : "text-slate-600 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            {user.is_active ? (
              <FiToggleLeft className="text-base" />
            ) : (
              <FiToggleRight className="text-base" />
            )}
            {user.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onDelete(user.id); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiTrash2 className="text-base" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const MiniAdminRow = ({ admin, onEdit, onDelete, onToggleActive }) => {
  const name = admin.user_profile?.full_name || "—";
  const phone = admin.phone_or_email || "—";
  const areas = admin.assined_area_data?.map((a) => a.name).join(", ") || "—";
  const tasks = admin.total_tasked_compelted ?? 0;

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
      <td className="px-4 py-3 text-sm text-slate-500">{admin.member_no}</td>
      <td className="px-4 py-3 text-sm font-medium text-slate-700">{name}</td>
      <td className="px-4 py-3 text-sm text-slate-500">{phone}</td>
      <td className="px-4 py-3 text-sm">
        <RoleBadge role={admin.role} />
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge isActive={admin.is_active} />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-blue-500">{areas}</td>
      <td className="px-4 py-3 text-sm text-slate-500">{tasks}</td>
      <td className="px-4 py-3 text-sm text-slate-500">
        <ActionMenu
          user={admin}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      </td>
    </tr>
  );
};

const MiniAdminCard = ({ admin, onEdit, onDelete, onToggleActive }) => {
  const name = admin.user_profile?.full_name || "—";
  const phone = admin.phone_or_email || "—";
  const areas = admin.assined_area_data?.map((a) => a.name).join(", ") || "—";
  const tasks = admin.total_tasked_compelted ?? 0;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-400">#{admin.member_no}</p>
          <div className="mt-1 flex items-center gap-2">
            <RoleBadge role={admin.role} />
            <StatusBadge isActive={admin.is_active} />
          </div>
        </div>
        <ActionMenu
          user={admin}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      </div>

      <dl className="grid grid-cols-1 gap-y-2 text-xs sm:grid-cols-2 sm:gap-x-4">
        <div>
          <dt className="text-slate-400">Phone / Email</dt>
          <dd className="font-medium text-slate-600">{phone}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Tasks Completed</dt>
          <dd className="font-medium text-slate-600">{tasks}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-400">Location</dt>
          <dd className="font-semibold text-blue-500">{areas}</dd>
        </div>
      </dl>
    </article>
  );
};

const MiniAdminTable = ({ admins, emptyLabel = "mini admins", onEdit, onDelete }) => {
  const [toggleActive] = useToggleUserActiveMutation();

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await toggleActive(id).unwrap();
      toast.success(
        currentStatus ? "User deactivated successfully!" : "User activated successfully!"
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to toggle user status.");
    }
  };

  if (!admins || admins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 text-slate-400">
        <p className="text-lg font-semibold">No {emptyLabel} found</p>
        <p className="mt-1 text-sm">Try another name, email, or phone</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              {[
                "Member No",
                "Name",
                "Phone / Email",
                "Role",
                "Status",
                "Location",
                "Tasks Completed",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <MiniAdminRow
                key={admin.id}
                admin={admin}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {admins.map((admin) => (
          <MiniAdminCard
            key={admin.id}
            admin={admin}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
    </>
  );
};

export default MiniAdminTable;
