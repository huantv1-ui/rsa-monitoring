
import React, { useState, useEffect } from 'react';
import { Order, UserRole } from '../types';
import { REQUEST_STATUS_LABELS } from '../constants';

interface OrderTableProps {
  orders: Order[];
  onVerifyClick: (order: Order) => void;
  onDetailClick: (order: Order) => void;
  onSupportClick: (order: Order) => void;
  onAssignClick: (order: Order) => void;
  onReassignOSA?: (order: Order) => void;
  currentUser: string;
  userRole: UserRole;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onVerifyClick, onDetailClick, onSupportClick, onAssignClick, onReassignOSA, currentUser, userRole }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parseDateStr = (dateStr: string) => {
    if (!dateStr || dateStr === '---') return null;
    try {
      const [datePart, timePart] = dateStr.split(' - ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hour, min, sec] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hour, min, sec);
    } catch (e) {
      return null;
    }
  };

  const calculateWaitTime = (order: Order) => {
    const createdDate = parseDateStr(order.createdAt);
    if (!createdDate) return '---';
    const isLive = ['INITIAL', 'CONFIRMED', 'ASSIGNING'].includes(order.orderStatus);
    const endTime = isLive ? now : (parseDateStr(order.updatedAt) || now);
    const diffMs = endTime.getTime() - createdDate.getTime();
    if (diffMs < 0) return '0p';
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}p`;
    }
    return `${minutes}p ${seconds}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INITIAL':
        return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-black border border-blue-100 uppercase text-[9px]">Khởi tạo</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-black border border-emerald-100 uppercase text-[9px]">Xác nhận</span>;
      case 'ASSIGNING':
        return <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-black border border-indigo-100 uppercase text-[9px]">Điều phối</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full font-black border border-amber-100 uppercase text-[9px]">Đang xử lý</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 bg-slate-50 text-slate-500 rounded-full font-black border border-slate-200 uppercase text-[9px]">Hoàn thành</span>;
      case 'FAILED':
        return <span className="px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full font-black border border-red-100 uppercase text-[9px]">Thất bại</span>;
      default:
        return <span className="text-slate-400 italic text-[10px]">{status}</span>;
    }
  };

  const renderDisabledAction = (tooltip: string) => (
    <div className="relative group/btn">
      <button disabled className="p-2 bg-slate-50 text-slate-300 rounded-lg border border-slate-100 cursor-not-allowed opacity-50 grayscale transition-all">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </button>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl tracking-tighter ring-1 ring-white/20">{tooltip}</span>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-visible flex flex-col mb-4 shadow-xl shadow-slate-200/50">
      <div className="bg-[#00a651] px-5 py-3.5 flex items-center justify-between rounded-t-xl border-b border-white/10">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
             <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
           </div>
           <h3 className="text-white font-black text-[14px] uppercase tracking-wider">Danh sách quản lý đơn cứu hộ</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">{orders.length} bản ghi</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin overflow-y-visible">
        <table className="w-full text-left border-collapse min-w-[1900px]">
          <thead>
            <tr className="bg-slate-100/80 text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
              <th rowSpan={2} className="p-4 w-12 text-center sticky left-0 bg-slate-100 z-30 shadow-[1px_0_0_0_#e2e8f0]">STT</th>
              <th rowSpan={2} className="p-4 w-40 text-center sticky left-12 bg-slate-100 z-30 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">Hành động</th>
              <th colSpan={5} className="p-3 text-center border-l border-slate-200 bg-blue-50/20 text-blue-600/70">Thông tin cơ bản đơn hàng</th>
              <th colSpan={3} className="p-3 text-center border-l border-slate-200 bg-emerald-50/20 text-emerald-600/70">Thông tin đối tượng cứu hộ</th>
              <th colSpan={2} className="p-3 text-center border-l border-slate-200 bg-indigo-50/20 text-indigo-600/70">Vận hành & Đối tác</th>
            </tr>
            <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-200">
              <th className="p-3 border-l border-slate-100 w-40 text-center">Mã đơn</th>
              <th className="p-3 border-l border-slate-100 w-48">Dịch vụ chính</th>
              <th className="p-3 border-l border-slate-100 w-32 text-center">Thời gian chờ</th>
              <th className="p-3 border-l border-slate-100 w-36 text-center">Trạng thái đơn</th>
              <th className="p-3 border-l border-slate-100 w-40 text-center">Người hỗ trợ</th>
              <th className="p-3 border-l border-slate-100 w-48">Khách hàng</th>
              <th className="p-3 border-l border-slate-100 w-40 text-center">Phương tiện</th>
              <th className="p-3 border-l border-slate-100 w-64 text-center">Địa chỉ cứu hộ</th>
              <th className="p-3 border-l border-slate-100 w-40">Đối tác thực hiện</th>
              <th className="p-3 border-l border-slate-100 w-40">Tài xế/Đội ngũ</th>
            </tr>
          </thead>
          <tbody className="text-[11px] text-slate-600 bg-white">
            {orders.length > 0 ? orders.map((order, idx) => {
              const waitTime = calculateWaitTime(order);
              const isWaitingStatus = ['INITIAL', 'CONFIRMED', 'ASSIGNING'].includes(order.orderStatus);
              const isTerminalStatus = ['COMPLETED', 'FAILED'].includes(order.orderStatus);
              const isInitial = order.orderStatus === 'INITIAL';
              
              const cskhName = order.cskhName && order.cskhName !== '---' ? order.cskhName : null;
              const osaName = order.osaName && order.osaName !== '---' ? order.osaName : null;
              
              const isCSKHMe = cskhName === currentUser;
              const isCSKHOther = cskhName && cskhName !== currentUser;
              const isCSKHEmpty = !cskhName;

              const isOSAMe = osaName === currentUser;
              const isOSAAny = osaName && osaName !== currentUser;
              const isOSAEmpty = !osaName;

              let actionButtons = null;

              if (userRole === 'CSKH' && !isInitial) {
                actionButtons = renderDisabledAction("CSKH chỉ xử lý đơn Khởi tạo");
              } else if (isTerminalStatus) {
                actionButtons = renderDisabledAction("Đơn hàng đã kết thúc");
              } else if (userRole === 'CSKH') {
                if (isCSKHEmpty) {
                  actionButtons = (
                    <div className="relative group/btn">
                      <button onClick={() => onSupportClick(order)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-all border border-amber-100 shadow-sm flex items-center gap-1.5 px-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl ring-1 ring-white/20">Xác minh đơn hàng</span>
                    </div>
                  );
                } else if (isCSKHMe) {
                  actionButtons = (
                    <div className="relative group/btn">
                      <button onClick={() => onVerifyClick(order)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-all border border-amber-100 shadow-sm flex items-center gap-1.5 px-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl ring-1 ring-white/20">Xác minh đơn hàng</span>
                    </div>
                  );
                } else {
                  actionButtons = renderDisabledAction("CSKH khác đang xử lý");
                }
              } else if (userRole === 'OSA') {
                if (isCSKHOther || isOSAAny) {
                  actionButtons = renderDisabledAction("Người khác đang xử lý");
                } else if (isCSKHEmpty) {
                  actionButtons = (
                    <div className="relative group/btn">
                      <button onClick={() => onAssignClick(order)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-all border border-amber-100 shadow-sm flex items-center gap-1.5 px-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl ring-1 ring-white/20">Xác minh đơn hàng</span>
                    </div>
                  );
                } else if (isCSKHMe && order.orderStatus === 'INITIAL') {
                  actionButtons = (
                    <div className="relative group/btn">
                      <button onClick={() => onVerifyClick(order)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-all border border-amber-100 shadow-sm flex items-center gap-1.5 px-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </button>
                    </div>
                  );
                } else if (isOSAMe && ['CONFIRMED', 'ASSIGNING', 'IN_PROGRESS'].includes(order.orderStatus)) {
                  actionButtons = (
                    <div className="flex items-center gap-2">
                      <div className="relative group/btn">
                        <button onClick={() => onReassignOSA && onReassignOSA(order)} className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all border border-indigo-100 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl ring-1 ring-white/20">Chuyển tiếp hỗ trợ OSA</span>
                      </div>
                      <div className="relative group/btn">
                        <button onClick={() => onDetailClick(order)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-100 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl ring-1 ring-white/20">Điều phối đơn hàng</span>
                      </div>
                    </div>
                  );
                } else {
                  actionButtons = renderDisabledAction("Không thuộc phạm vi xử lý");
                }
              }

              return (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                  <td className="p-4 text-center font-bold text-slate-300 sticky left-0 bg-white group-hover:bg-slate-50 z-20 shadow-[1px_0_0_0_#f1f5f9]">
                    {idx + 1}
                  </td>
                  <td className="p-4 sticky left-12 bg-white group-hover:bg-slate-50 z-20 hover:z-50 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)] overflow-visible">
                    <div className="flex items-center justify-center gap-2">
                      {actionButtons}
                      <div className="relative group/btn">
                        <button onClick={() => onDetailClick(order)} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-800 hover:text-white rounded-lg transition-all border border-slate-200 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none uppercase shadow-xl tracking-tighter ring-1 ring-white/20">Chi tiết đơn</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 tracking-tighter text-[12px]">{order.orderCode}</span>
                        {order.verificationStatus === 'Đã xác minh' && (
                          <div className="group/verify relative">
                             <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center text-[#00a651]">
                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                             </div>
                          </div>
                        )}
                        {order.verificationStatus === 'Không đạt' && (
                          <div className="group/verify relative">
                             <div className="w-4 h-4 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                             </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <span className="px-1.5 py-0.5 rounded-[3px] bg-blue-600 text-white text-[7px] font-black uppercase tracking-wider">{order.typeBadge}</span>
                        <span className="px-1.5 py-0.5 rounded-[3px] bg-slate-900 text-white text-[7px] font-black uppercase tracking-wider">{order.sourceBadge}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {order.service.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-bold text-[10px] shadow-sm">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100 text-center">
                    <span className={`font-black text-[13px] tracking-tighter ${!isWaitingStatus ? 'text-slate-300' : (waitTime.includes('h') ? 'text-red-500 animate-pulse' : 'text-slate-800')}`}>
                      {waitTime}
                    </span>
                  </td>
                  <td className="p-3 border-l border-slate-100 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      {getStatusBadge(order.orderStatus)}
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter bg-slate-50 px-1.5 rounded border border-slate-100">
                        {REQUEST_STATUS_LABELS[order.requestStatus] || order.requestStatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 text-[7px] font-black text-emerald-600 bg-emerald-50 py-0.5 rounded-full border border-emerald-100 text-center shrink-0 tracking-tighter">SUPPORT</div>
                        <span className={`text-[10px] font-black uppercase truncate tracking-tight ${order.cskhName && order.cskhName !== '---' && order.cskhName !== '' ? (order.cskhName === currentUser ? 'text-blue-600' : 'text-slate-600') : 'text-slate-300 italic'}`}>
                          {order.cskhName && order.cskhName !== '---' ? (order.cskhName === currentUser ? `${order.cskhName} (Tôi)` : order.cskhName) : '---'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 text-[7px] font-black text-indigo-600 bg-indigo-50 py-0.5 rounded-full border border-indigo-100 text-center shrink-0 tracking-tighter">OPERATOR</div>
                        <span className={`text-[10px] font-black uppercase truncate tracking-tight ${order.osaName && order.osaName !== '---' && order.osaName !== '' ? (order.osaName === currentUser ? 'text-indigo-600' : 'text-slate-600') : 'text-slate-300 italic'}`}>
                          {order.osaName && order.osaName !== '---' ? (order.osaName === currentUser ? `${order.osaName} (Tôi)` : order.osaName) : '---'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 uppercase tracking-tight text-[12px] leading-tight">{order.customer.name}</span>
                      <span className="text-blue-600 font-bold text-[10px]">{order.customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-black text-slate-900 leading-none bg-white border-[2.5px] border-slate-900 px-2 py-1 rounded-lg w-fit text-[12px] shadow-sm">{order.vehicle.plate}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{order.vehicle.brand} • {order.vehicle.model}</span>
                    </div>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    <p className="text-slate-500 italic leading-snug text-[10px] line-clamp-2 max-w-[240px]">{order.address}</p>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    <span className="font-black text-indigo-600 uppercase tracking-tighter text-[10px]">{order.supportPartner || '---'}</span>
                  </td>
                  <td className="p-3 border-l border-slate-100">
                    {order.driver ? (
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-[11px] leading-tight">{order.driver.name}</span>
                        <span className="text-slate-400 text-[10px] font-bold">{order.driver.phone}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">---</span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={12} className="p-24 text-center text-slate-300 font-black uppercase tracking-[0.2em] bg-slate-50/10">KHÔNG CÓ DỮ LIỆU ĐƠN HÀNG PHÙ HỢP</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 text-[11px] text-slate-400 shrink-0 rounded-b-xl">
        <div className="flex items-center gap-6">
          <span className="font-black uppercase tracking-widest text-slate-500">Hiển thị 1 - {orders.length} / {orders.length} kết quả</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-slate-400 border border-transparent hover:border-slate-200 transition-all cursor-pointer">&laquo;</button>
          <button className="w-8 h-8 flex items-center justify-center bg-[#00a651] text-white rounded-lg font-black shadow-lg shadow-emerald-700/20 active:scale-95 transition-all">1</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-slate-400 border border-transparent hover:border-slate-200 transition-all cursor-pointer">&raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
