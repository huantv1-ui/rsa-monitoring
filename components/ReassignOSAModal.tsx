
import React, { useState } from 'react';
import { Order, SupervisionOrder } from '../types';

interface ReassignOSAModalProps {
  order: Order | SupervisionOrder;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  currentUser: string;
}

const ReassignOSAModal: React.FC<ReassignOSAModalProps> = ({ order, onClose, onConfirm, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState('');

  const availableOSA = [
    { id: 'osa_staff_1', name: 'Đỗ Tiến Dũng (OSA)' },
    { id: 'osa_staff_2', name: 'Nguyễn Văn Hùng (OSA)' },
    { id: 'osa_staff_3', name: 'Lê Minh Phụng (OSA)' },
    { id: 'osa_staff_4', name: 'Trần Văn Hòa (OSA)' }
  ];

  const getOrderData = () => {
    if ('customer' in order) {
      return {
        code: order.orderCode,
        name: order.customer.name,
        plate: order.vehicle.plate
      };
    } else {
      return {
        code: order.orderCode,
        name: order.customerName,
        plate: order.plate
      };
    }
  };

  const data = getOrderData();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-indigo-100 bg-indigo-50/30 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-indigo-900 font-bold text-lg uppercase tracking-tight leading-tight">Chuyển tiếp hỗ trợ OSA</h3>
        </div>

        <div className="p-6">
          <p className="text-[11px] text-slate-400 font-medium mb-4 italic text-center">
            Bạn đang yêu cầu bàn giao nhiệm vụ OSA của đơn hàng này cho nhân sự khác xử lý.
          </p>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Đơn hàng hiện tại</p>
            <p className="text-sm font-bold text-indigo-600 truncate">{data.code}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[11px] text-slate-500 truncate mr-2">{data.name}</span>
              <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-[9px] font-black rounded shrink-0">{data.plate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nhân sự OSA tiếp nhận</label>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-slate-700 font-medium"
            >
              <option value="" disabled>-- Chọn nhân sự OSA --</option>
              {availableOSA.map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all uppercase"
          >
            Đóng
          </button>
          <button 
            disabled={!selectedUser}
            onClick={() => onConfirm(selectedUser)}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-700/20 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Chuyển giao
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReassignOSAModal;
