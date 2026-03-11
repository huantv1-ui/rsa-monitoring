
import React, { useState, useEffect, useRef } from 'react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onCloseNotification: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onCloseNotification, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToasts, setShowToasts] = useState<Notification[]>([]);
  const lastProcessedId = useRef<string | null>(null);

  // Xử lý Toasts (Chỉ hiện thông báo mới nhất chưa đọc)
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length > 0) {
      const latest = unread[unread.length - 1];
      if (latest.id !== lastProcessedId.current) {
        lastProcessedId.current = latest.id;
        setShowToasts(prev => [...prev, latest]);
        
        // Tự động đóng toast sau 5 giây
        setTimeout(() => {
          setShowToasts(prev => prev.filter(t => t.id !== latest.id));
        }, 5000);
      }
    }
  }, [notifications]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'emergency': return { bg: 'bg-rose-500', icon: 'text-rose-500', light: 'bg-rose-50', border: 'border-rose-100' };
      case 'success': return { bg: 'bg-emerald-500', icon: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'warning': return { bg: 'bg-amber-500', icon: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-100' };
      default: return { bg: 'bg-blue-500', icon: 'text-blue-500', light: 'bg-blue-50', border: 'border-blue-100' };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* TOAST NOTIFICATIONS (Temporary overlays) */}
      <div className="flex flex-col gap-2 w-80 mb-2 pointer-events-auto">
        {showToasts.map(toast => {
          const style = getTypeStyle(toast.type);
          return (
            <div key={toast.id} className={`${style.light} border ${style.border} p-4 rounded-2xl shadow-2xl flex gap-3 animate-in slide-in-from-right duration-300 relative overflow-hidden group`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.bg}`}></div>
              <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0 shadow-lg shadow-black/5`}>
                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                 </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{toast.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => setShowToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-300 hover:text-slate-500 transition-colors">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* CHAT WINDOW / NOTIFICATION PANEL */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          {/* Panel Header */}
          <div className="p-5 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-black text-[13px] uppercase tracking-widest leading-none mb-1">System Alerts</h3>
                <p className="text-emerald-500 text-[9px] font-bold uppercase tracking-tighter">Hệ thống giám sát trực tuyến</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={onClearAll} className="p-2 text-slate-500 hover:text-white transition-colors" title="Dọn dẹp">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </button>
               <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          </div>

          {/* Messages List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {notifications.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 opacity-40">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  <p className="text-xs font-black uppercase tracking-widest">Hộp thư hệ thống trống</p>
               </div>
            ) : notifications.slice().reverse().map(note => {
              const style = getTypeStyle(note.type);
              return (
                <div key={note.id} className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left duration-500">
                   <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${style.icon}`}>{note.type} alert</span>
                      <span className="text-[8px] text-slate-600 font-bold uppercase">{note.timestamp}</span>
                   </div>
                   <div className={`p-4 rounded-2xl ${note.type === 'emergency' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-slate-800/50 border border-slate-700/50'} shadow-sm`}>
                      <p className="text-white text-[12px] font-black mb-1">{note.title}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{note.message}</p>
                      {note.orderId && (
                         <button className="mt-3 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-1">
                            Xem chi tiết đơn {note.orderId}
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
                         </button>
                      )}
                   </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="p-4 bg-slate-800/30 border-t border-slate-800 grid grid-cols-2 gap-3">
             <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase rounded-xl transition-all border border-slate-700">Lọc đơn quá hạn</button>
             <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase rounded-xl transition-all border border-slate-700">Trạng thái trạm</button>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (Toggle) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 pointer-events-auto relative group ${isOpen ? 'bg-slate-800 border-2 border-slate-700' : 'bg-emerald-600 border-4 border-slate-900 ring-4 ring-emerald-500/20'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        
        {/* Badge cho tin nhắn chưa đọc */}
        {!isOpen && notifications.filter(n => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-slate-900 group-hover:scale-110 transition-transform">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationCenter;
