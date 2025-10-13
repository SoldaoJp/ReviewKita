import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/Layout';
import { adminGetUsers, adminSearchUserByEmail, adminDeleteUser } from '../../controllers/adminController';

export default function AdminUsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState({}); // userId -> bool
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminGetUsers();
        setUsers(res.users || []);
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    const email = query.trim();
    if (!email) return;
    try {
      setLoading(true);
      const res = await adminSearchUserByEmail(email);
      if (res.user) {
        setUsers([res.user]);
      } else {
        setUsers([]);
      }
      setError('');
    } catch (e2) {
      setError(e2.message || 'Search failed');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const onClearSearch = async () => {
    setQuery('');
    setError('');
    try {
      setLoading(true);
      const res = await adminGetUsers();
      setUsers(res.users || []);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const onDeleteClick = (u) => {
    if (u.role === 'admin') return; // safety
    setUserToDelete(u);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!userToDelete) return;
    try {
      setLoading(true);
      const res = await adminDeleteUser(userToDelete._id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      await onClearSearch();
      if (res?.deletedReviewers !== undefined) {
        alert(`Deleted. Reviewers removed: ${res.deletedReviewers}`);
      }
    } catch (e) {
      alert(e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <input
              type="email"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search by email"
              className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">Search</button>
            <button type="button" onClick={onClearSearch} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Clear</button>
          </form>
        </div>
        {loading && <p className="text-gray-500">Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Verified</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <>
                    <tr key={u._id} className="border-t">
                      <td className="px-4 py-3">
                        <button onClick={()=>toggleExpand(u._id)} className="text-left font-medium hover:underline">
                          {u.username || '-'}
                        </button>
                      </td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">{u.isVerified ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 space-x-2">
                        {u.role !== 'admin' && (
                          <button onClick={()=>onDeleteClick(u)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                        )}
                      </td>
                    </tr>
                    {expanded[u._id] && (
                      <tr className="bg-gray-50/40">
                        <td colSpan={6} className="px-8 py-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Reviewers</h4>
                            <div className="rounded border">
                              <table className="w-full text-xs">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left">Title</th>
                                    <th className="px-3 py-2 text-left">Model</th>
                                    <th className="px-3 py-2 text-left">File Type</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(u.users_reviewer || []).length === 0 ? (
                                    <tr>
                                      <td className="px-3 py-2" colSpan={3}>No reviewers</td>
                                    </tr>
                                  ) : (
                                    (u.users_reviewer || []).map((r, idx) => (
                                      <tr key={idx} className="border-t">
                                        <td className="px-3 py-2">{r.reviewer_title}</td>
                                        <td className="px-3 py-2">{r.model_name}</td>
                                        <td className="px-3 py-2 uppercase">{r.file_type}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 relative">
              <h3 className="text-lg font-semibold mb-2">localhost:3000 says</h3>
              <p className="text-gray-700 mb-6">
                Delete user {userToDelete.email}? This will also delete their reviewers.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
