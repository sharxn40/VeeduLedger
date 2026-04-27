import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useBuildings } from '../hooks/useBuildings';
import { buildingService } from '../services/buildingService';
import { Building2, MapPin, Layers, Plus, Trash2, Eye, Loader2, Zap } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

const Buildings = () => {
  const { currentUser } = useAuth();
  const { notify, confirm } = useNotification();
  const { buildings, loading, refresh } = useBuildings(currentUser.uid);

  const handleDelete = async (id) => {
    confirm(
      "Delete Property",
      "Are you sure you want to remove this building? All associated units will remain but their property link will be archived.",
      async () => {
        try {
          await buildingService.delete(id);
          notify('success', "Building removed successfully.");
          refresh();
        } catch (err) {
          notify('error', "Failed to delete building.");
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Buildings</h1>
          <p className="text-gray-500 mt-1">Manage and track your property portfolio.</p>
        </div>
        <Link 
          to="/buildings/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} />
          Add Building
        </Link>
      </div>

      {buildings.length === 0 ? (
        <EmptyState 
          title="No Buildings Found"
          description="You haven't added any buildings yet. Start by adding your first property."
          icon={Building2}
          actionText="Add Building Now"
          actionLink="/buildings/add"
        />
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {buildings.map((building, idx) => (
            <motion.div 
              key={building.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card group hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 overflow-hidden flex flex-col border-none ring-1 ring-gray-100"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:rotate-6 transition-transform duration-500">
                    <Building2 size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button 
                      onClick={() => handleDelete(building.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      title="Delete Building"
                    >
                      <Trash2 size={18} />
                    </button>
                    {building.doorNumber && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <Zap size={10} className="fill-blue-600" />
                        KSmart Active
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{building.name}</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 font-medium flex items-start gap-2 leading-relaxed">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-blue-500" />
                    {building.address}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Layers size={14} className="text-gray-300" />
                      {building.totalFloors} Floors
                    </div>
                    {building.district && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <MapPin size={14} className="text-gray-300" />
                        {building.district}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gray-50/50 border-t border-gray-100/50 flex gap-2">
                <Link 
                  to={`/units?buildingId=${building.id}`}
                  className="flex-1 bg-white hover:bg-blue-600 text-gray-700 hover:text-white border border-gray-200 hover:border-blue-600 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Eye size={16} />
                  Manage Inventory
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Buildings;
