
import React, { useState, useMemo } from 'react';
import { SupervisionOrder, SupervisionFilterState, UserRole } from '../types';
import FilterPopup from './FilterPopup';

const SummaryCard: React.FC<{ 
  title: string; 
  count: string | number; 
  color: string; 
  icon: React.ReactNode; 
  isActive?: boolean;
  onClick?: () => void;
}> = ({ title, count, color, icon, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer select-none ${isActive ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/10 scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-300'}`}
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
      <p className="text-2xl font-black text-slate-800 leading-tight">{count}</p>
    </div>
  </div>
);

interface ActiveSupportDashboardProps {
  orders: SupervisionOrder[];
  onAcceptSupport: (order: SupervisionOrder) => void;
  onReassignOSA?: (order: SupervisionOrder) => void;
  userRole: UserRole;
}

const ActiveSupportDashboard: React.FC<ActiveSupportDashboardProps> = ({ orders, onAcceptSupport, onReassignOSA, userRole }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [supervisionFilters, setSupervisionFilters] = useState<SupervisionFilterState>({
    status: 'Tất cả',
    location: 'Tất cả',
    waitFrom: '',
    waitTo: ''
  });

  const statusGroups = {
    'Chờ xác nhận': ['WaitingConfirm', 'NoStation', 'MissingInfo'],
    'Chờ giám sát': ['SearchingPartner', 'Repairing', 'Assigned', 'Expired']
  };

  // Only show orders that are IN active support
  const activeOrders = useMemo(() => orders.filter(o => o.isInActiveSupport), [orders]);

  const filteredOrders = useMemo(() => {
    return activeOrders.filter(order => {
      // 1. Status Mapping
      if (supervisionFilters.status !== 'Tất cả') {
        const statusMap: Record<string, string[]> = {
          'Chờ xác nhận': statusGroups['Chờ xác nhận'],
          'Chờ giám sát': statusGroups['Chờ giám sát'],
          'Đang tìm kiếm': ['SearchingPartner'],
          'Đang sửa chữa': ['Repairing', 'Assigned'],
          'Quá hạn': ['Expired']
        };
        const allowed = statusMap[supervisionFilters.status] || [];
        if (!allowed.includes(order.status)) return false;
      }

      // 2. Location filter
      if (supervisionFilters.location !== 'Tất cả' && !order.location.includes(supervisionFilters.location)) {
        return false;
      }

      // 3. Wait Time filter
      const waitMinutes = parseInt(order.waitTime.split('p')[0]) || 0;
      if (supervisionFilters.waitFrom && waitMinutes < parseInt(supervisionFilters.waitFrom)) return false;
      if (supervisionFilters.waitTo && waitMinutes > parseInt(supervisionFilters.waitTo)) return false;

      return true;
    });
  }, [supervisionFilters, activeOrders]);

  const counts = useMemo(() => {
    return {
      expired: activeOrders.filter(o => o.status === 'Expired').length,
      waitingConfirm: activeOrders.filter(o => statusGroups['Chờ xác nhận'].includes(o.status)).length,
      supervision: activeOrders.filter(o => statusGroups['Chờ giám sát'].includes(o.status)).length,
    };
  }, [activeOrders]);

  const handleCardClick = (status: string) => {
    setSupervisionFilters(prev => ({ ...prev, status }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SearchingPartner':
        return (
          <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-200 uppercase flex items-center gap-1.5">
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
            ĐANG TÌM KIẾM ĐỐI TÁC...
          </span>
        );
      case 'Expired':
        return (
          <span className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-200 uppercase flex items-center gap-1.5">
             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
             YÊU CẦU QUÁ HẠN (&gt;15P)
          </span>
        );
      case 'NoStation':
        return (
          <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded border border-orange-200 uppercase flex items-center gap-1.5">
             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
             KHÔNG TÌM THẤY TRẠM
          </span>
        );
      case 'MissingInfo':
        return (
          <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded border border-purple-200 uppercase flex items-center gap-1.5">
             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
             THIẾU THÔNG TIN DỊCH VỤ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard 
          title="TỔNG ĐƠN CHỜ" 
          count={activeOrders.length} 
          color="bg-blue-50 text-blue-500" 
          isActive={supervisionFilters.status === 'Tất cả'}
          onClick={() => handleCardClick('Tất cả')}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        <SummaryCard 
          title="ĐƠN QUÁ HẠN" 
          count={counts.expired} 
          color="bg-red-50 text-red-500" 
          isActive={supervisionFilters.status === 'Quá hạn'}
          onClick={() => handleCardClick('Quá hạn')}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} 
        />
        <SummaryCard 
          title="CHỜ XÁC NHẬN" 
          count={counts.waitingConfirm} 
          color="bg-orange-50 text-orange-500" 
          isActive={supervisionFilters.status === 'Chờ xác nhận'}
          onClick={() => handleCardClick('Chờ xác nhận')}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
        />
        <SummaryCard 
          title="CHỜ GIÁM SÁT" 
          count={counts.supervision} 
          color="bg-purple-50 text-purple-500" 
          isActive={supervisionFilters.status === 'Chờ giám sát'}
          onClick={() => handleCardClick('Chờ giám sát')}
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} 
        />
        <SummaryCard 
          title="HIỆU SUẤT XỬ LÝ" 
          count="92%" 
          color="bg-emerald-50 text-emerald-500" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
        />
      </div>

      {/* Search Header */}
      <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm">
        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã đơn, biển số, SĐT khách hàng..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a651]/10"
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${showFilters || supervisionFilters.status !== 'Tất cả' ? 'bg-[#00a651] text-white shadow-lg shadow-emerald-700/10' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Bộ lọc {supervisionFilters.status !== 'Tất cả' ? `(${supervisionFilters.status})` : ''}
        </button>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Danh sách đơn cứu hộ đang hỗ trợ ({filteredOrders.length})</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cập nhật thời gian thực</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                <th className="px-6 py-4">THÔNG TIN ĐƠN</th>
                <th className="px-6 py-4">KHÁCH HÀNG</th>
                <th className="px-6 py-4 text-center">PHƯƠNG TIỆN</th>
                <th className="px-6 py-4">VỊ TRÍ & DỊCH VỤ</th>
                <th className="px-6 py-4 text-center">THỜI GIAN CHỜ</th>
                <th className="px-6 py-4 text-center">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-bold text-blue-600"># {order.orderCode}</span>
                      <div className="flex gap-1.5">
                        <span className="px-1.5 py-0.5 border border-blue-200 text-blue-500 text-[9px] font-bold rounded uppercase">Gói VETC</span>
                        <span className="px-1.5 py-0.5 border border-emerald-200 text-emerald-500 text-[9px] font-bold rounded uppercase">APP</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="text-[13px] font-bold text-slate-800 uppercase">{order.customerName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium pl-5">{order.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="px-3 py-1 bg-white border-[2px] border-slate-900 text-slate-900 text-[13px] font-black rounded-lg shadow-sm">
                        {order.plate}
                      </span>
                      <div className="flex items-center gap-1">
                         <svg className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11.05a2.5 2.5 0 014.9 0H17a1 1 0 001-1V5a1 1 0 00-1-1H3z" /></svg>
                         <span className="text-[9px] font-bold text-slate-400 uppercase">{order.vehicleModel}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2 max-w-[200px]">
                      <div className="flex items-start gap-1.5">
                         <svg className="w-3.5 h-3.5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                         <span className="text-[11px] text-slate-500 font-medium leading-relaxed">{order.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-5">
                        {order.services.map((s, idx) => (
                          <span key={idx} className={`px-2 py-0.5 text-[9px] font-bold rounded border ${order.status === 'MissingInfo' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <svg className={`w-4 h-4 ${order.isUrgent ? 'text-red-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-[14px] font-black ${order.isUrgent ? 'text-red-600' : 'text-slate-700'}`}>{order.waitTime}</span>
                      </div>
                      {order.isUrgent && <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Cần xử lý gấp</span>}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center">
                      {getStatusBadge(order.status)}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* Hiển thị icon Reassign cho Role OSA khi ở trạng thái phù hợp */}
                      {userRole === 'OSA' && ['SearchingPartner', 'Assigned', 'Repairing'].includes(order.status) && (
                        <div className="relative group/btn">
                          <button 
                            onClick={() => onReassignOSA && onReassignOSA(order)}
                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm border border-indigo-100"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[9px] font-bold rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-lg">Chuyển người hỗ trợ OSA</span>
                        </div>
                      )}

                      {order.status === 'Expired' || order.status === 'MissingInfo' ? (
                        <button className="px-4 py-2 bg-[#ff8a00] text-white text-[11px] font-black rounded-lg shadow-sm shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           Xác minh
                        </button>
                      ) : (
                        <button 
                          onClick={() => onAcceptSupport(order)}
                          className="px-4 py-2 bg-[#1b64f2] text-white text-[11px] font-black rounded-lg shadow-sm shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase flex items-center gap-2"
                        >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                           Điều phối
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-sm font-medium">Không tìm thấy đơn cứu hộ nào đang hỗ trợ khớp với bộ lọc.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Footer */}
        <div className="px-6 py-4 bg-blue-50/50 border-t border-slate-50 flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-[11px] text-[#4285f4] font-bold">Màn hình hỗ trợ phối điều phối viên giám sát và can thiệp thủ công vào các đơn hàng đang xử lý.</p>
        </div>
      </div>

      {showFilters && (
        <FilterPopup 
          initialFilters={supervisionFilters}
          onApply={setSupervisionFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default ActiveSupportDashboard;
