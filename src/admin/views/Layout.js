import "../../index.css";
import AdminSidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
      <div className="flex-shrink-0">
        <AdminSidebar />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default AdminLayout;


