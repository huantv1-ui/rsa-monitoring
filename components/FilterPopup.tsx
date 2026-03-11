
import React, { useState } from 'react';
import { SupervisionFilterState } from '../types';

interface FilterPopupProps {
  initialFilters: SupervisionFilterState;
  onApply: (filters: SupervisionFilterState) => void;
  onClose: () => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ initialFilters, onApply, onClose }) => {
  const [localFilters, setLocalFilters] = useState<SupervisionFilterState>(initialFilters);

  const locations = ["Tất cả", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Quảng Ninh", "Thanh Hóa"];
  const statuses = ["Tất cả", "Chờ xác nhận", "Chờ giám sát", "Đang tìm kiếm", "Đang sửa chữa", "Quá hạn"];

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const reset = { status: 'Tất cả', location: 'Tất cả', waitFrom: '', waitTo: '' };
    setLocalFilters(reset);
    onApply(reset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#00a651] p-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Bộ lọc nâng cao
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={localFilters.status}
              onChange={(e) => setLocalFilters({...localFilters, status: e.target.value})}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vị trí (Tỉnh/Thành)</label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={localFilters.location}
              onChange={(e) => setLocalFilters({...localFilters, location: e.target.value})}
            >
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Thời gian chờ (phút)</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TỪ</span>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={localFilters.waitFrom}
                  onChange={(e) => setLocalFilters({...localFilters, waitFrom: e.target.value})}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ĐẾN</span>
                <input 
                  type="number" 
                  placeholder="120"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={localFilters.waitTo}
                  onChange={(e) => setLocalFilters({...localFilters, waitTo: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={handleReset}
              className="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all uppercase"
            >
              Xóa bộ lọc
            </button>
            <button 
              onClick={handleApply}
              className="px-4 py-3 bg-[#00a651] text-white rounded-xl text-sm font-bold hover:bg-[#009245] shadow-lg shadow-emerald-700/10 transition-all uppercase"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
