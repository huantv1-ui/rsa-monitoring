
import React, { useState } from 'react';
import { Order } from '../types';

interface AssignModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  currentUser: string;
}

const AssignModal: React.FC<AssignModalProps> = ({ order, onClose, onConfirm, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState('');

  const availableCSKH = [
    { id: 'rsa_staff_1', name: 'Nguyễn Hoàng Nam (CSKH)' },
    { id: 'rsa_staff_2', name: 'Trần Minh Tuấn (CSKH)' },
    { id: 'rsa_staff_3', name: 'Lê Thị Thu Thảo (CSKH)' },
    { id: 'rsa_staff_4', name: 'Phạm Công Danh (CSKH)' },
    { id: 'rsa_staff_5', name: 'Vũ Bảo Ngọc (CSKH)' }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="text-slate-800 font-bold text-lg uppercase tracking-tight">Phân công hỗ trợ</h3>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Đơn hàng cần xác nhận</p>
            <p className="text-sm font-bold text-indigo-600">{order.orderCode}</p>
            <p className="text-[11px] text-slate-500">{order.customer.name} - {order.vehicle.plate}</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Chọn nhân sự tiếp nhận (CSKH)</label>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-slate-700 font-medium"
            >
              <option value="" disabled>-- Chọn nhân sự --</option>
              <option value={currentUser} className="font-bold text-blue-600">Tôi ({currentUser})</option>
              <optgroup label="Danh sách CSKH">
                {availableCSKH.map(user => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all uppercase"
          >
            Hủy
          </button>
          <button 
            disabled={!selectedUser}
            onClick={() => onConfirm(selectedUser)}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-700/10 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Giao việc
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
