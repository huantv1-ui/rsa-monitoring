
import React, { useState, useMemo } from 'react';
import { SupervisionOrder, SupervisionFilterState, UserRole } from '../types';
import FilterPopup from '../components/FilterPopup';

const SummaryCard: React.FC<{ title: string; count: string | number; color: string; icon: React.ReactNode; isActive?: boolean; onClick?: () => void; }> = ({ title, count, color, icon, isActive, onClick }) => (
  <div onClick={onClick} className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer select-none ${isActive ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/10 scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
      <p className="text-2xl font-black text-slate-800 leading-tight">{count}</p>
    </div>
  </div>
);

interface ActiveSupportProps {
  orders: SupervisionOrder[];
  onAcceptSupport: (order: SupervisionOrder) => void;
  onReassignOSA?: (order: SupervisionOrder) => void;
  userRole: UserRole;
}

const ActiveSupport: React.FC<ActiveSupportProps> = ({ orders, onAcceptSupport, onReassignOSA, userRole }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [supervisionFilters, setSupervisionFilters] = useState<SupervisionFilterState>({ status: 'Tất cả', location: 'Tất cả', waitFrom: '', waitTo: '' });

  const activeOrders = useMemo(() => orders.filter(o => o.isInActiveSupport), [orders]);

  const filteredOrders = useMemo(() => {
    return activeOrders.filter(order => {
      if (supervisionFilters.status !== 'Tất cả' && order.status !== supervisionFilters.status) return false;
      if (supervisionFilters.location !== 'Tất cả' && !order.location.includes(supervisionFilters.location)) return false;
      return true;
    });
  }, [supervisionFilters, activeOrders]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard title="ĐANG HỖ TRỢ" count={activeOrders.length} color="bg-blue-50 text-blue-500" isActive={true} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-slate-800 uppercase">Danh sách đơn đang hỗ trợ ({filteredOrders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50/30">
                <th className="px-6 py-4">THÔNG TIN ĐƠN</th>
                <th className="px-6 py-4 text-center">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6 font-bold text-blue-600"># {order.orderCode}</td>
                  <td className="px-6 py-6 text-center text-xs">
                     <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{order.status}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      {userRole === 'OSA' && (
                        <div className="relative group">
                          <button 
                            onClick={() => onReassignOSA && onReassignOSA(order)} 
                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all border border-indigo-100 shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <button onClick={() => onAcceptSupport(order)} className="px-4 py-2 bg-[#1b64f2] text-white text-[11px] font-black rounded-lg shadow-lg shadow-blue-200/20 hover:bg-blue-700 transition-all uppercase">ĐIỀU PHỐI</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveSupport;
