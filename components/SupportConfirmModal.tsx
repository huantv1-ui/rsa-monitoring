
import React from 'react';
import { SupervisionOrder } from '../types';

interface SupportConfirmModalProps {
  order: SupervisionOrder;
  onClose: () => void;
  onConfirm: () => void;
}

const SupportConfirmModal: React.FC<SupportConfirmModalProps> = ({ order, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#00a651]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-slate-800 font-bold text-lg uppercase tracking-tight">Xác nhận hỗ trợ</h3>
        </div>

        <div className="p-6 text-center">
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Bạn có chắc chắn muốn nhận hỗ trợ ca cứu hộ này?
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-left mb-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Đơn hàng</p>
            <p className="text-sm font-bold text-[#00a651]">{order.orderCode}</p>
            <p className="text-[11px] text-slate-500">{order.customerName} - {order.plate}</p>
          </div>
          <p className="text-[11px] text-slate-400 font-medium italic">
            * Đơn hàng sẽ được chuyển sang màn hình "Đang hỗ trợ" sau khi xác nhận.
          </p>
        </div>

        <div className="p-4 bg-slate-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all uppercase"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#00a651] text-white rounded-xl text-sm font-bold hover:bg-[#009245] shadow-lg shadow-emerald-700/10 transition-all uppercase"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportConfirmModal;
