import "../../index.css";
import AdminSidebar from "./Sidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout({ children, topbarProps = {} }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
      <div className="flex-shrink-0">
        <AdminSidebar />
      </div>
      <main className="flex-1 flex flex-col">
        {/* Topbar stays fixed at the top; content below becomes scrollable */}
        <div className="w-full pt-3 sticky top-3 z-40 px-6 pb-3">
          <AdminTopbar {...topbarProps} />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;



