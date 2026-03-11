
import React, { useState, useMemo, useEffect } from 'react';
import { SupervisionOrder, SupervisionFilterState, Notification } from '../types';
import FilterPopup from '../components/FilterPopup';

const SectionHeader: React.FC<{ number: number; title: string; id?: string; color?: string; action?: React.ReactNode }> = ({ number, title, id, color = "bg-slate-800", action }) => (
  <div id={id} className={`${color} px-4 py-2 flex items-center gap-3 shadow-lg rounded-t-xl`}>
    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-[11px] font-black border border-white/20 shadow-inner">
      {number}
    </div>
    <h3 className="text-white font-black text-[14px] uppercase tracking-widest leading-none">{title}</h3>
    <div className="ml-auto flex items-center gap-2">
      {action ? action : (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[9px] text-emerald-100 font-bold uppercase tracking-tighter">Live Sync</span>
        </>
      )}
    </div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string; isBold?: boolean; color?: string }> = ({ label, value, isBold, color = "text-slate-700" }) => (
  <div className="flex flex-col gap-0.5 py-1 border-b border-slate-50 last:border-0">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-[13px] ${isBold ? 'font-black' : 'font-medium'} ${color} truncate`}>{value}</span>
  </div>
);

const MetricBox: React.FC<{ 
  label: string; 
  value: string | number; 
  color: string; 
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ label, value, color, isSelected, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center min-w-[100px] transition-all active:scale-95 shadow-sm ${isSelected ? 'bg-white/20 border-white ring-2 ring-white/20 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
  >
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
    <span className={`text-lg font-black ${color} tracking-tighter leading-none`}>{value}</span>
  </button>
);

const RescueSupervision: React.FC<{ orders: SupervisionOrder[]; notifications: Notification[]; onAcceptSupport: (order: SupervisionOrder) => void }> = ({ orders, notifications, onAcceptSupport }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState<'all' | 'expired' | 'verify' | 'searching' | 'waiting'>('all');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const availableOrders = useMemo(() => orders.filter(o => !o.isInActiveSupport), [orders]);

  const counts = useMemo(() => ({
    all: availableOrders.length,
    expired: availableOrders.filter(o => o.status === 'Expired').length,
    verify: availableOrders.filter(o => o.verificationStatus === 'Chờ xác minh' || o.status === 'MissingInfo').length,
    searching: availableOrders.filter(o => ['Searching', 'SearchingPartner'].includes(o.status)).length,
    waiting: availableOrders.filter(o => ['WaitingConfirm', 'NoStation'].includes(o.status)).length
  }), [availableOrders]);

  const filteredList = useMemo(() => {
    switch (selectedTab) {
      case 'expired': return availableOrders.filter(o => o.status === 'Expired');
      case 'verify': return availableOrders.filter(o => o.verificationStatus === 'Chờ xác minh' || o.status === 'MissingInfo');
      case 'searching': return availableOrders.filter(o => ['Searching', 'SearchingPartner'].includes(o.status));
      case 'waiting': return availableOrders.filter(o => ['WaitingConfirm', 'NoStation'].includes(o.status));
      default: return availableOrders;
    }
  }, [selectedTab, availableOrders]);

  const activeOrder = useMemo(() => {
    const current = availableOrders.find(o => o.id === activeOrderId);
    return current || filteredList[0] || null;
  }, [activeOrderId, filteredList, availableOrders]);

  return (
    <div className="px-2 py-2 space-y-3 w-full pb-24 bg-[#f8fafc]">
      {/* MISSION CONTROL CENTER HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <h1 className="text-white font-black text-[12px] uppercase tracking-widest leading-none mb-0.5">Operational Environment</h1>
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-tighter italic">Mission Control Display</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <MetricBox label="Tổng đơn chờ" value={counts.all} color="text-white" isSelected={selectedTab === 'all'} onClick={() => setSelectedTab('all')} />
             <MetricBox label="Đơn quá hạn" value={counts.expired} color="text-rose-500" isSelected={selectedTab === 'expired'} onClick={() => setSelectedTab('expired')} />
             <MetricBox label="Cần xác minh" value={counts.verify} color="text-amber-500" isSelected={selectedTab === 'verify'} onClick={() => setSelectedTab('verify')} />
             <MetricBox label="Đang tìm đối tác" value={counts.searching} color="text-blue-500" isSelected={selectedTab === 'searching'} onClick={() => setSelectedTab('searching')} />
             <MetricBox label="Chờ xác nhận" value={counts.waiting} color="text-indigo-400" isSelected={selectedTab === 'waiting'} onClick={() => setSelectedTab('waiting')} />
          </div>
        </div>

        {/* RSA SYSTEM LOGS - COMPACT HEADER SECTION */}
        <div className="flex items-center gap-4 bg-slate-800/40 rounded-xl px-3 py-1 border border-slate-700/50">
          <div className="flex flex-col border-r border-slate-700 pr-3 mr-1">
            <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">System Health</span>
            <span className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">RSA LOGS</span>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: 'Phủ trạm', value: '88%', color: 'text-emerald-500' },
              { label: 'Latency', value: '1.2s', color: 'text-blue-500' },
              { label: 'Đơn/Giờ', value: '45', color: 'text-indigo-500' },
              { label: 'SLA', value: '94.5%', color: 'text-amber-500' }
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">{m.label}</span>
                <span className={`text-[11px] font-black ${m.color} tracking-tighter leading-none`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-tighter mb-1">Trạng thái hiện tại</p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-tight">Đang cứu hộ</span>
              <svg className="w-2.5 h-2.5 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
          <div className="text-right pr-2 border-l border-slate-800 pl-4">
             <p className="text-white font-black text-xs tracking-widest uppercase">{currentTime.toLocaleTimeString('vi-VN')}</p>
             <p className="text-slate-500 text-[8px] font-bold uppercase tracking-tighter">Real-time Data Active</p>
          </div>
        </div>
      </div>

      {/* ROW 1: COMMAND QUEUE (LEFT) & MONITORING ENVIRONMENT (CENTER/RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* COMMAND QUEUE */}
         <section className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px] lg:min-h-0">
            <SectionHeader number={1} title="Command Queue" color="bg-slate-800" />
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
               {filteredList.map((o) => (
                  <div 
                    key={o.id} 
                    onClick={() => setActiveOrderId(o.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all relative group cursor-pointer ${activeOrder?.id === o.id ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/40' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                  >
                     <div className="flex justify-between items-start mb-0.5">
                        <span className={`text-[13px] font-black tracking-tighter ${activeOrder?.id === o.id ? 'text-white' : 'text-blue-400'}`}>{o.orderCode.split('-').pop() || o.orderCode}</span>
                        <div className="flex items-center gap-1.5">
                           {(o.verificationStatus === 'Chờ xác minh' || o.status === 'MissingInfo') && (
                             <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                           )}
                           <span className={`text-[11px] font-bold uppercase ${activeOrder?.id === o.id ? 'text-white/70' : 'text-rose-50'}`}>{o.waitTime}</span>
                        </div>
                     </div>
                     <p className={`text-[12px] font-black uppercase truncate ${activeOrder?.id === o.id ? 'text-white' : 'text-slate-200'}`}>{o.customerName}</p>
                     <p className={`text-[10px] opacity-60 truncate mt-0.5 mb-2 ${activeOrder?.id === o.id ? 'text-white' : 'text-slate-500'}`}>{o.location}</p>
                     
                     <div className="flex gap-1.5">
                        <button onClick={(e) => { e.stopPropagation(); onAcceptSupport(o); }} className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${activeOrder?.id === o.id ? 'bg-white text-indigo-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>Tiếp nhận</button>
                        {(o.verificationStatus === 'Chờ xác minh' || o.status === 'MissingInfo') && (
                          <button onClick={(e) => { e.stopPropagation(); }} className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${activeOrder?.id === o.id ? 'bg-indigo-900/40 text-white' : 'bg-amber-500 text-white hover:bg-amber-400'}`}>Xác minh</button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* LIVE MONITORING COMMAND ENVIRONMENT */}
         <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative aspect-video lg:aspect-[16/10]">
            <SectionHeader number={2} title="Live Monitoring Command Environment" color="bg-indigo-600" />
            <div className="flex-1 relative bg-slate-900">
               {/* MAP BACKDROP */}
               <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=21.0285,105.8452&zoom=14&size=1200x800&sensor=false&style=feature:all|element:labels.text.fill|color:0xffffff&style=feature:landscape|color:0x2c3e50&style=feature:road|color:0x34495e')] bg-cover bg-center opacity-80"></div>
               
               {/* OVERLAY: TRANSPARENT CHAT ALERT STACK (TOP RIGHT) */}
               <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 w-72 pointer-events-none">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest text-right mb-1">Incident Alert Stream</p>
                  <div className="space-y-2 max-h-[400px] overflow-hidden pointer-events-auto scrollbar-none">
                    {[...notifications].reverse().slice(0, 4).map(note => (
                      <div key={note.id} className={`p-3 rounded-xl backdrop-blur-md border animate-in slide-in-from-right duration-500 shadow-2xl border-white/10 ${note.type === 'emergency' ? 'bg-rose-900/60 text-rose-50 shadow-rose-900/20' : 'bg-slate-900/60 text-slate-50'}`}>
                        <div className="flex justify-between items-start mb-1 gap-2">
                           <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${note.type === 'emergency' ? 'bg-rose-500' : 'bg-emerald-500'}`}>{note.type}</span>
                           <span className="text-[7px] font-bold opacity-40 uppercase tracking-tighter">{note.timestamp}</span>
                        </div>
                        <p className="text-[10px] font-black leading-tight mb-0.5">{note.title}</p>
                        <p className="text-[9px] opacity-70 leading-snug line-clamp-2">{note.message}</p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Indicator Overlays (Top Left) */}
               <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex items-center gap-3 shadow-2xl">
                     <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Khu vực giám sát</p>
                        <p className="text-[11px] font-black text-white leading-none uppercase">TP. Hà Nội</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* SECTION 3: THÔNG TIN KHÁCH HÀNG LIÊN HỆ */}
         <section className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <SectionHeader number={3} title="Thông tin khách hàng" color="bg-emerald-600" />
            <div className="p-3 flex-1 flex flex-col overflow-y-auto scrollbar-thin">
               <div className="space-y-1 flex-1">
                  <InfoRow label="Tên khách hàng" value={activeOrder?.customerName || '---'} isBold />
                  <InfoRow label="Số điện thoại" value={activeOrder?.phone || '---'} isBold color="text-blue-600" />
                  <InfoRow label="Biển số xe" value={activeOrder?.plate || '---'} isBold />
                  <InfoRow label="Dòng xe / Phương tiện" value={activeOrder?.vehicleModel || 'MAZDA CX-5'} />
                  <InfoRow label="Vị trí cứu hộ" value={activeOrder?.location || '---'} />
                  <InfoRow label="Dịch vụ yêu cầu" value={activeOrder?.services.join(', ') || '---'} isBold color="text-emerald-600" />
               </div>
               <div className="mt-1.5 pt-1.5 border-t border-slate-50 flex flex-col gap-1">
                  <button className="w-full bg-emerald-600 text-white py-1 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Xác nhận
                  </button>
                  <button className="w-full bg-blue-600 text-white py-1 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" /></svg>
                    Hoàn thành
                  </button>
                  <button className="w-full bg-white border border-red-200 text-red-600 py-1 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    Hủy
                  </button>
               </div>
            </div>
         </section>
      </div>

      {/* ROW 2: MEDIA & LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* SECTION 5: HÌNH ẢNH SỰ CỐ & QUÁ TRÌNH */}
         <section className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
           <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[300px] overflow-y-auto scrollbar-thin">
              {[
                 { label: 'HIỆN TRƯỜNG SỰ CỐ', imgs: [
                   'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300'
                 ] },
                 { label: 'QUÁ TRÌNH XỬ LÝ', imgs: [
                   'https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=300'
                 ] },
                 { label: 'HOÀN TẤT CỨU HỘ', imgs: [
                   'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1578844541663-47139a33cce5?auto=format&fit=crop&q=80&w=300',
                   'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=300'
                 ] }
              ].map((row, i) => (
                 <div key={i} className="space-y-2 border-r border-slate-100 last:border-0 pr-4 last:pr-0">
                    <div className="flex items-center justify-between">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{row.label}</span>
                       <span className="text-[7px] font-bold text-slate-400">{row.imgs.length}/5</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                       {row.imgs.map((img, idx) => (
                          <div key={idx} className="group relative overflow-hidden rounded-lg border border-slate-100 shadow-sm shrink-0">
                             <img src={img} className="w-16 h-16 object-cover transition-all duration-300 group-hover:scale-110" referrerPolicy="no-referrer" />
                          </div>
                       ))}
                       <div className="w-16 h-16 border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-300 rounded-lg shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
         </section>

         {/* SECTION 4: THÔNG TIN ĐIỀU PHỐI CỨU HỘ & ĐỐI TÁC */}
         <section className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <SectionHeader number={4} title="Thông tin điều phối cứu hộ & Đối tác" color="bg-indigo-600" />
            <div className="p-6 flex-1 flex flex-col">
               <div className="grid grid-cols-3 gap-x-8 gap-y-4 flex-1">
                  <InfoRow label="Đối tác thực hiện" value="CARPLA SERVICE" isBold color="text-indigo-600" />
                  <InfoRow label="Tài xế tiếp nhận" value="Nguyễn Văn Tài" isBold />
                  <InfoRow label="Trạm cứu hộ" value="Trạm 01 - Cầu Giấy, Hà Nội" />
                  <InfoRow label="SĐT Tài xế" value="0988.123.456" isBold color="text-blue-500" />
                  <InfoRow label="Biển số cứu hộ" value="29A-888.88" isBold />
                  <InfoRow label="Khoảng cách" value="4.5 km" />
                  <div className="col-span-3 pt-2">
                     <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <p className="text-[10px] font-black text-blue-700 uppercase tracking-tight">Trạng thái vận hành: Đang di chuyển đến hiện trường</p>
                     </div>
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex gap-3">
                  <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Điều phối tự động
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    Điều phối thủ công
                  </button>
               </div>
            </div>
         </section>
      </div>

      {/* ROW 3: LOGS REMOVED AND MOVED TO HEADER */}
      <div className="hidden">
      </div>

      {showFilters && (
        <FilterPopup 
          initialFilters={{ status: 'Tất cả', location: 'Tất cả', waitFrom: '', waitTo: '' }}
          onApply={() => setShowFilters(false)}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default RescueSupervision;
