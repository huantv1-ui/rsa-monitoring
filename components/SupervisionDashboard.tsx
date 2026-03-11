
import React, { useState, useMemo } from 'react';
import { SupervisionOrder, SupervisionFilterState } from '../types';
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

interface SupervisionDashboardProps {
  orders: SupervisionOrder[];
  onAcceptSupport: (order: SupervisionOrder) => void;
}

const SupervisionDashboard: React.FC<SupervisionDashboardProps> = ({ orders, onAcceptSupport }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [supervisionFilters, setSupervisionFilters] = useState<SupervisionFilterState>({
    status: 'Tất cả',
    location: 'Tất cả',
    waitFrom: '',
    waitTo: ''
  });

  // Logic mapping for "Chờ xác nhận" and "Chờ giám sát"
  const statusGroups = {
    'Chờ xác nhận': ['WaitingConfirm', 'NoStation', 'MissingInfo'],
    'Chờ giám sát': ['Searching', 'SearchingPartner', 'Repairing', 'Assigned', 'Expired']
  };

  // Only show orders that are NOT in active support yet
  const availableOrders = useMemo(() => orders.filter(o => !o.isInActiveSupport), [orders]);

  const filteredOrders = useMemo(() => {
    return availableOrders.filter(order => {
      // 1. Status Mapping
      if (supervisionFilters.status !== 'Tất cả') {
        const statusMap: Record<string, string[]> = {
          'Chờ xác nhận': statusGroups['Chờ xác nhận'],
          'Chờ giám sát': statusGroups['Chờ giám sát'],
          'Đang tìm kiếm': ['Searching', 'SearchingPartner'],
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
  }, [supervisionFilters, availableOrders]);

  const counts = useMemo(() => {
    return {
      expired: availableOrders.filter(o => o.status === 'Expired').length,
      waitingConfirm: availableOrders.filter(o => statusGroups['Chờ xác nhận'].includes(o.status)).length,
      supervision: availableOrders.filter(o => statusGroups['Chờ giám sát'].includes(o.status)).length,
    };
  }, [availableOrders]);

  const handleCardClick = (status: string) => {
    setSupervisionFilters(prev => ({ ...prev, status }));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Summary Cards Grid - 5 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard 
          title="TỔNG ĐƠN CHỜ" 
          count={availableOrders.length} 
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

      {/* Search & Actions */}
      <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã đơn, biển số, SĐT khách hàng..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#00a651]/20 outline-none placeholder:text-slate-400"
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${showFilters || supervisionFilters.status !== 'Tất cả' || supervisionFilters.location !== 'Tất cả' ? 'bg-[#00a651] text-white shadow-lg shadow-emerald-700/10' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Bộ lọc {supervisionFilters.status !== 'Tất cả' ? `(${supervisionFilters.status})` : ''}
        </button>
      </div>

      {/* List section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Danh sách đơn cứu hộ đang giám sát ({filteredOrders.length})</h3>
          </div>
          <span className="text-[11px] text-slate-400 italic font-medium">Tự động cập nhật mỗi 5 giây</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">THÔNG TIN ĐƠN</th>
                <th className="px-6 py-4">KHÁCH HÀNG & PHƯƠNG TIỆN</th>
                <th className="px-6 py-4">VỊ TRÍ & DỊCH VỤ</th>
                <th className="px-6 py-4 text-center">THỜI GIAN CHỜ</th>
                <th className="px-6 py-4 text-center">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-blue-600"># {order.orderCode}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{order.fullCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{order.customerName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium pl-5">{order.phone}</span>
                      <div className="mt-1 pl-5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded border border-slate-200">{order.plate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-1.5">
                        <svg className="w-4 h-4 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        <span className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[200px]">{order.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-5">
                        {order.services.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded border border-emerald-100">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[14px] font-black text-slate-700">{order.waitTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      {order.status === 'Searching' || order.status === 'SearchingPartner' ? (
                        <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-bold rounded-full border border-blue-100 animate-pulse uppercase tracking-tight">
                          Đang tìm kiếm...
                        </span>
                      ) : order.status === 'NoStation' ? (
                        <span className="px-3 py-1 bg-orange-50 text-orange-500 text-[10px] font-bold rounded-full border border-orange-100 uppercase tracking-tight">
                          Không tìm thấy trạm
                        </span>
                      ) : order.status === 'WaitingConfirm' ? (
                        <span className="px-3 py-1 bg-purple-50 text-purple-500 text-[10px] font-bold rounded-full border border-purple-100 uppercase tracking-tight">
                          Chờ xác nhận
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-tight">
                          Đã phân công
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onAcceptSupport(order)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#00a651] text-white text-[11px] font-black rounded-lg hover:bg-[#009245] active:scale-95 transition-all shadow-lg shadow-emerald-700/10"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        NHẬN HỖ TRỢ
                      </button>
                      <button className="text-slate-300 hover:text-slate-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-sm font-medium">Không tìm thấy đơn cứu hộ nào khớp với bộ lọc.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default SupervisionDashboard;
