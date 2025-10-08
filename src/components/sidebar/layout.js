// src/components/layout/Layout.js
import "../../index.css";
import Sidebar from "../sidebar/sidebar";
function Layout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}

export default Layout;
