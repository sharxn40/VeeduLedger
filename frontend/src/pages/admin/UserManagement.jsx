import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Shield, 
  User, 
  MoreVertical,
  Loader2,
  Mail,
  Calendar,
  CheckCircle2
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (uid, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(uid, newRole);
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Control access and permissions across the system.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by email..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Joined</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-black">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.email?.split('@')[0]}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.role === 'admin' 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                    {user.role?.toUpperCase() || 'USER'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleRole(user.id, user.role)}
                    className="text-xs font-black text-blue-600 hover:underline px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    Set as {user.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-black">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.email?.split('@')[0]}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                user.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {user.role || 'user'}
              </span>
            </div>
            
            <button 
              onClick={() => toggleRole(user.id, user.role)}
              className="w-full py-2 bg-slate-50 text-slate-900 font-bold text-sm rounded-lg border border-slate-200"
            >
              Set as {user.role === 'admin' ? 'User' : 'Admin'}
            </button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
