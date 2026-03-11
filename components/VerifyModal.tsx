
import React, { useState } from 'react';
import { Order, VerificationStatus } from '../types';

interface VerifyModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (status: VerificationStatus) => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({ order, onClose, onConfirm }) => {
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-emerald-600 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
            Xác minh đơn hàng
          </h3>
          <button onClick={onClose} className="text-emerald-100 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Thông tin đơn</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-black text-emerald-700 leading-tight">{order.orderCode}</p>
                <p className="text-xs text-slate-500 font-medium">{order.customer.name} - {order.customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700">{order.vehicle.plate}</p>
                <p className="text-[10px] text-slate-400">{order.service[0]}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 block">Ghi chú xác minh</label>
            <textarea 
              className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all placeholder:text-slate-300"
              placeholder="Nhập nội dung ghi chú/lý do xác minh..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onConfirm('Không đạt')}
              className="px-4 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              TỪ CHỐI
            </button>
            <button 
              onClick={() => onConfirm('Đã xác minh')}
              className="px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              PHÊ DUYỆT
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
          <p className="text-[10px] text-slate-400 font-medium">Dữ liệu sau khi xác minh sẽ được lưu trữ vào lịch sử hệ thống.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;
