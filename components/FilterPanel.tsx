
import React, { useState, useRef, useEffect } from 'react';
import { FilterState, UserRole } from '../types';
import { STATUS_MAPPING, REQUEST_STATUS_LABELS } from '../constants';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onSearch: () => void;
  onMySupport: () => void;
  onNotSupported: () => void;
  onClear: () => void;
  userRole: UserRole;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onSearch, onMySupport, onNotSupported, onClear, userRole }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<HTMLDivElement>(null);

  const orderStatusOptions = [
    { value: 'INITIAL', label: 'Khởi tạo (INITIAL)' },
    { value: 'CONFIRMED', label: 'Xác nhận (CONFIRMED)' },
    { value: 'ASSIGNING', label: 'Điều phối (ASSIGNING)' },
    { value: 'IN_PROGRESS', label: 'Đang thực hiện (IN_PROGRESS)' },
    { value: 'COMPLETED', label: 'Hoàn thành (COMPLETED)' },
    { value: 'FAILED', label: 'Thất bại (FAILED)' },
  ];

  const availableRequestStatuses = React.useMemo(() => {
    if (filters.orderStatus.includes('Tất cả') || filters.orderStatus.length === 0) {
      return Array.from(new Set(Object.values(STATUS_MAPPING).flat())).sort();
    }
    return Array.from(new Set(filters.orderStatus.flatMap(state => STATUS_MAPPING[state] || []))).sort();
  }, [filters.orderStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) setIsStatusOpen(false);
      if (requestRef.current && !requestRef.current.contains(event.target as Node)) setIsRequestOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOrderStatus = (val: string) => {
    let next = [...filters.orderStatus];
    if (val === 'Tất cả') {
      next = ['Tất cả'];
    } else {
      next = next.filter(s => s !== 'Tất cả');
      if (next.includes(val)) {
        next = next.filter(s => s !== val);
        if (next.length === 0) next = ['Tất cả'];
      } else {
        next.push(val);
      }
    }
    onFilterChange('orderStatus', next);
    onFilterChange('requestStatus', ['Tất cả']);
  };

  const toggleRequestStatus = (val: string) => {
    let next = [...filters.requestStatus];
    if (val === 'Tất cả') {
      next = ['Tất cả'];
    } else {
      next = next.filter(s => s !== 'Tất cả');
      if (next.includes(val)) {
        next = next.filter(s => s !== val);
        if (next.length === 0) next = ['Tất cả'];
      } else {
        next.push(val);
      }
    }
    onFilterChange('requestStatus', next);
  };

  const labelClass = "text-[12px] font-bold text-slate-500 w-32 shrink-0 leading-tight uppercase tracking-tight";
  const inputClass = "w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[12px] focus:outline-none focus:ring-2 focus:ring-[#00a651]/10 focus:border-[#00a651] transition-all text-slate-700 font-medium placeholder:text-slate-300 shadow-sm";
  const selectClass = "w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[12px] focus:outline-none focus:ring-2 focus:ring-[#00a651]/10 focus:border-[#00a651] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:14px_14px] bg-no-repeat bg-[right_8px_center] transition-all cursor-pointer text-slate-700 font-medium shadow-sm";

  const getOrderStatusLabel = (vals: string[]) => {
    if (vals.includes('Tất cả')) return 'Tất cả';
    if (vals.length === 0) return 'Tất cả';
    if (vals.length === 1) {
      const opt = orderStatusOptions.find(o => o.value === vals[0]);
      return opt ? opt.label : vals[0];
    }
    return `Đã chọn (${vals.length})`;
  };

  const getRequestStatusLabel = (vals: string[]) => {
    if (vals.includes('Tất cả')) return 'Tất cả';
    if (vals.length === 0) return 'Tất cả';
    if (vals.length === 1) {
      const status = vals[0];
      const label = REQUEST_STATUS_LABELS[status] || status;
      return label === status ? status : `${label} (${status})`;
    }
    return `Đã chọn (${vals.length})`;
  };

  const handleExportExcel = () => {
    console.log("Đang xuất danh sách đơn hàng sang Excel...");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm relative z-40 overflow-visible transition-all hover:shadow-md">
      <div className="bg-slate-50 px-5 py-3 flex items-center gap-3 border-b border-slate-100 rounded-t-xl">
        <div className="w-8 h-8 bg-[#00a651] rounded-lg flex items-center justify-center shadow-lg shadow-emerald-700/10">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-slate-800 text-[14px] font-black uppercase tracking-wider">Bộ lọc tra cứu đơn hàng</h2>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-5">
          <div className="flex items-center">
            <label className={labelClass}>Mã đơn hàng</label>
            <input type="text" placeholder="Nhập mã đơn..." className={inputClass} value={filters.orderCode} onChange={(e) => onFilterChange('orderCode', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Số điện thoại</label>
            <input type="text" placeholder="Nhập SĐT..." className={inputClass} value={filters.phone} onChange={(e) => onFilterChange('phone', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Biển số xe</label>
            <input type="text" placeholder="30H-123.45" className={inputClass} value={filters.plate} onChange={(e) => onFilterChange('plate', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-5">
          <div className="flex items-center">
            <label className={labelClass}>Dịch vụ</label>
            <select className={selectClass} value={filters.service} onChange={(e) => onFilterChange('service', e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="Kích bình ắc quy">Kích bình ắc quy</option>
              <option value="Thay lốp dự phòng">Thay lốp dự phòng</option>
              <option value="Cứu hộ kéo xe">Cứu hộ kéo xe</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Đối tác</label>
            <select className={selectClass} value={filters.partner} onChange={(e) => onFilterChange('partner', e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="CARPLA SERVICE">CARPLA SERVICE</option>
              <option value="RSA PARTNER">RSA PARTNER</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Trạm cứu hộ</label>
            <select className={selectClass} value={filters.tollStation} onChange={(e) => onFilterChange('tollStation', e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="Trạm Hà Nội">Trạm Hà Nội</option>
              <option value="Trạm Hồ Chí Minh">Trạm Hồ Chí Minh</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-5">
          <div className="flex items-center">
            <label className={labelClass}>Từ ngày *</label>
            <input type="date" className={inputClass} value={filters.fromDate} onChange={(e) => onFilterChange('fromDate', e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Đến ngày *</label>
            <input type="date" className={inputClass} value={filters.toDate} onChange={(e) => onFilterChange('toDate', e.target.value)} />
          </div>
          {/* Cần xác minh đã bị xóa khỏi UI theo yêu cầu */}
          <div className="hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-5">
          <div className="flex items-center relative" ref={statusRef}>
            <label className={labelClass}>Tình trạng đơn</label>
            <div className={`${selectClass} flex items-center bg-slate-50`} onClick={() => setIsStatusOpen(!isStatusOpen)}>
              <span className="truncate">{getOrderStatusLabel(filters.orderStatus)}</span>
            </div>
            {isStatusOpen && (
              <div className="absolute top-full left-32 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className={`flex items-center gap-2 px-4 py-2 text-[12px] cursor-pointer hover:bg-slate-50 font-bold ${filters.orderStatus.includes('Tất cả') ? 'text-[#00a651]' : 'text-slate-600'}`} onClick={() => toggleOrderStatus('Tất cả')}>
                  Tất cả
                </div>
                {orderStatusOptions.map(opt => (
                  <div key={opt.value} className={`flex items-center gap-2 px-4 py-2 text-[12px] cursor-pointer hover:bg-slate-50 font-bold ${filters.orderStatus.includes(opt.value) ? 'text-[#00a651]' : 'text-slate-600'}`} onClick={() => toggleOrderStatus(opt.value)}>
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center relative" ref={requestRef}>
            <label className={labelClass}>Trạng thái xử lý</label>
            <div className={`${selectClass} flex items-center bg-slate-50`} onClick={() => setIsRequestOpen(!isRequestOpen)}>
              <span className="truncate">{getRequestStatusLabel(filters.requestStatus)}</span>
            </div>
            {isRequestOpen && (
              <div className="absolute top-full left-32 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] py-2 max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                <div className={`flex items-center gap-2 px-4 py-2 text-[12px] cursor-pointer hover:bg-slate-50 font-bold ${filters.requestStatus.includes('Tất cả') ? 'text-[#00a651]' : 'text-slate-600'}`} onClick={() => toggleRequestStatus('Tất cả')}>
                  Tất cả
                </div>
                {availableRequestStatuses.map(status => {
                  const label = REQUEST_STATUS_LABELS[status] || status;
                  const displayLabel = label === status ? status : `${label} (${status})`;
                  return (
                    <div key={status} className={`flex items-center gap-2 px-4 py-2 text-[12px] cursor-pointer hover:bg-slate-50 font-bold ${filters.requestStatus.includes(status) ? 'text-[#00a651]' : 'text-slate-600'}`} onClick={() => toggleRequestStatus(status)}>
                      {displayLabel}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Người hỗ trợ</label>
            <select className={selectClass} value={filters.supporter} onChange={(e) => onFilterChange('supporter', e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="NONE">Chưa phân công</option>
              <option value="rsa_test1">rsa_test1 (Tôi)</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </div>

        <div className="pt-6 flex justify-between items-center border-t border-slate-100">
          <div>
            {userRole === 'OSA' && (
              <button 
                onClick={handleExportExcel}
                className="px-5 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-black transition-all uppercase tracking-wider flex items-center gap-2 shadow-sm hover:bg-emerald-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất Excel
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onMySupport}
              className={`px-5 py-2 border rounded-lg text-[12px] font-black transition-all uppercase tracking-wider flex items-center gap-2 shadow-sm ${filters.supporter === 'rsa_test1' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Đang hỗ trợ
            </button>
            <button 
              onClick={onNotSupported}
              className={`px-5 py-2 border rounded-lg text-[12px] font-black transition-all uppercase tracking-wider flex items-center gap-2 shadow-sm ${filters.supporter === 'NONE' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Chưa hỗ trợ
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button 
              onClick={onClear} 
              className="px-6 py-2 border border-slate-300 rounded-lg text-[12px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wider"
            >
              Tất cả
            </button>
            <button 
              onClick={onSearch} 
              className="px-10 py-2 bg-[#00a651] text-white rounded-lg text-[12px] font-black hover:bg-[#009245] transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
