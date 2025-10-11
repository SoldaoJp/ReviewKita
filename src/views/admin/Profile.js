import AdminLayout from '../../components/admin/Layout';
import { useAuth } from '../../controllers/AuthContext';

export default function AdminProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-8">No user data</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Full name</div>
              <div className="font-medium">{user.name || user.fullName || user.username}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Role</div>
              <div className="font-medium">{user.role || (user.isAdmin ? 'admin' : 'user')}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Joined</div>
              <div className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div>
            </div>
          </div>

          {/* raw user object removed for cleaner UI */}
        </div>
      </div>
    </AdminLayout>
  );
}
