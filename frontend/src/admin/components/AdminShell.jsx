import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLayout from "./AdminLayout";

const AdminShell = () => {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-gray-600 dark:text-gray-300">Завантаження…</div>
      </div>
    );
  }

  if (!admin?.token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminShell;
