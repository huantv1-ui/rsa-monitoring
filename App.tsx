
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrderManagement from './pages/OrderManagement';
import RescueSupervision from './pages/RescueSupervision';
import ActiveSupport from './pages/ActiveSupport';
import OrderDetail from './pages/OrderDetail';
import SupportConfirmModal from './components/SupportConfirmModal';
import AssignModal from './components/AssignModal';
import VerifyModal from './components/VerifyModal';
import ReassignOSAModal from './components/ReassignOSAModal';
import NotificationCenter from './components/NotificationCenter';
import { Order, FilterState, SupervisionOrder, UserRole, VerificationStatus, Notification } from './types';
import { MOCK_ORDERS, MOCK_SUPERVISION_DATA } from './constants';

const App: React.FC = () => {
  const currentUser = "rsa_test1";
  const navigate = useNavigate();
  const location = useLocation();
  
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(MOCK_ORDERS);
  const [supervisionOrders, setSupervisionOrders] = useState<SupervisionOrder[]>(MOCK_SUPERVISION_DATA);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(location.pathname !== '/rescue-supervision');

  useEffect(() => {
    if (location.pathname === '/rescue-supervision') {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);
  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<Order | null>(null);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<Order | null>(null);
  const [selectedOrderForVerify, setSelectedOrderForVerify] = useState<Order | null>(null);
  const [selectedOrderForReassignOSA, setSelectedOrderForReassignOSA] = useState<Order | SupervisionOrder | null>(null);
  const [detailEditMode, setDetailEditMode] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [confirmSupportOrder, setConfirmSupportOrder] = useState<SupervisionOrder | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState(new Date().toLocaleString('vi-VN'));
  const [userRole, setUserRole] = useState<UserRole>('CSKH');

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info', orderId?: string) => {
    const newNote: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      orderId,
      isRead: false
    };
    setNotifications(prev => [...prev, newNote]);
  };

  // Giả lập thông báo hệ thống
  useEffect(() => {
    const timers = [
      setTimeout(() => addNotification('Đơn hàng khẩn cấp', 'Đơn #RS-38A58531 đã quá hạn 15 phút chưa được xác nhận!', 'emergency', 'RS-38A58531'), 3000),
      setTimeout(() => addNotification('Hệ thống cập nhật', 'Tài xế Nguyễn Văn Tài đã đến hiện trường đơn #RS-DOTW-001', 'success', 'RS-DOTW-001'), 8000),
      setTimeout(() => addNotification('Trạm cứu hộ Online', 'Trạm Cầu Giấy vừa kích hoạt trạng thái sẵn sàng.', 'info'), 15000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTimeStr(new Date().toLocaleString('vi-VN')), 1000);
    return () => clearInterval(timer);
  }, []);

  const getInitialFilters = (role: UserRole): FilterState => ({
    orderCode: '',
    phone: '',
    plate: '',
    service: 'Tất cả',
    partner: 'Tất cả',
    tollStation: 'Tất cả',
    orderStatus: role === 'CSKH' ? ['INITIAL'] : ['INITIAL', 'CONFIRMED', 'ASSIGNING', 'IN_PROGRESS'], 
    requestStatus: ['Tất cả'],
    verificationStatus: 'Tất cả',
    supporter: currentUser, 
    fromDate: '2026-02-01',
    toDate: '2026-02-28',
  });

  const [filters, setFilters] = useState<FilterState>(getInitialFilters(userRole));

  const handleRoleSwitch = (role: UserRole) => {
    setUserRole(role);
    setFilters(getInitialFilters(role));
    addNotification('Chế độ vận hành', `Đã chuyển sang quyền hạn ${role}`, 'info');
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMySupport = () => {
    const status = userRole === 'CSKH' ? ['INITIAL'] : ['INITIAL', 'CONFIRMED', 'ASSIGNING', 'IN_PROGRESS'];
    setFilters(prev => ({ ...prev, supporter: currentUser, orderStatus: status }));
  };

  const handleNotSupported = () => {
    const status = userRole === 'CSKH' ? ['INITIAL'] : ['INITIAL', 'CONFIRMED', 'ASSIGNING', 'IN_PROGRESS'];
    setFilters(prev => ({ ...prev, supporter: 'NONE', orderStatus: status }));
  };

  const handleClearFilters = () => {
    setFilters({
      orderCode: '', phone: '', plate: '', service: 'Tất cả', partner: 'Tất cả', tollStation: 'Tất cả',
      orderStatus: ['Tất cả'], requestStatus: ['Tất cả'], verificationStatus: 'Tất cả', supporter: 'Tất cả',
      fromDate: '2026-02-01', toDate: '2026-02-28',
    });
  };

  const applyFilters = () => {
    let result = [...orders];
    if (filters.supporter === currentUser) {
      if (userRole === 'OSA') {
        result = result.filter(o => (o.osaName === currentUser && ['CONFIRMED', 'ASSIGNING', 'IN_PROGRESS'].includes(o.orderStatus)) || (o.cskhName === currentUser && o.orderStatus === 'INITIAL'));
      } else {
        result = result.filter(o => o.cskhName === currentUser && o.orderStatus === 'INITIAL');
      }
    } else if (filters.supporter === 'NONE') {
      if (userRole === 'OSA') {
        result = result.filter(o => ((!o.osaName || o.osaName === '---') && ['CONFIRMED', 'ASSIGNING', 'IN_PROGRESS'].includes(o.orderStatus)) || ((!o.cskhName || o.cskhName === '---') && o.orderStatus === 'INITIAL'));
      } else {
        result = result.filter(o => (!o.cskhName || o.cskhName === '---') && o.orderStatus === 'INITIAL');
      }
    } else if (filters.supporter !== 'Tất cả') {
      result = result.filter(o => o.cskhName === filters.supporter || o.osaName === filters.supporter);
    }
    if (filters.orderCode) result = result.filter(o => o.orderCode.toLowerCase().includes(filters.orderCode.toLowerCase()));
    if (filters.phone) result = result.filter(o => o.customer.phone.includes(filters.phone));
    if (filters.plate) result = result.filter(o => o.vehicle.plate.toLowerCase().includes(filters.plate.toLowerCase()));
    if (filters.verificationStatus !== 'Tất cả') result = result.filter(o => o.verificationStatus === filters.verificationStatus);
    if (!filters.orderStatus.includes('Tất cả')) result = result.filter(o => filters.orderStatus.includes(o.orderStatus));
    setFilteredOrders(result);
  };

  useEffect(() => { applyFilters(); }, [filters, orders, userRole]);

  const handleVerifyClick = (order: Order) => {
    setDetailEditMode(true);
    setScrollTarget('section-1');
    navigate(`/order-detail/${order.id}`);
  };

  const handleVerifyConfirm = (status: VerificationStatus) => {
    if (selectedOrderForVerify) {
      setOrders(prev => prev.map(o => o.id === selectedOrderForVerify.id ? { ...o, verificationStatus: status } : o));
      addNotification('Xác minh thành công', `Đơn ${selectedOrderForVerify.orderCode} đã được ${status.toLowerCase()}`, status === 'Đã xác minh' ? 'success' : 'warning');
    }
    setSelectedOrderForVerify(null);
  };

  const handleCoordinationClick = (order: Order) => {
    setDetailEditMode(true);
    const target = order.orderStatus === 'ASSIGNING' ? 'section-2' : order.orderStatus === 'IN_PROGRESS' ? 'section-3' : null;
    setScrollTarget(target);
    navigate(`/order-detail/${order.id}`);
  };

  const handleAssignConfirm = (orderId: string, assignedTo: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cskhName: assignedTo } : o));
    addNotification('Phân công đơn', `Đã bàn giao đơn cho ${assignedTo} xử lý.`, 'success');
    setSelectedOrderForAssign(null);
    setSelectedOrderForSupport(null);
  };

  const handleReassignOSAConfirm = (userId: string) => {
    if (!selectedOrderForReassignOSA) return;
    const targetId = selectedOrderForReassignOSA.id;
    setOrders(prev => prev.map(o => o.id === targetId ? { ...o, osaName: userId } : o));
    setSupervisionOrders(prev => prev.map(o => o.id === targetId ? { ...o, osaName: userId } : o));
    addNotification('Chuyển tiếp OSA', `Đơn hàng đã được chuyển cho ${userId} tiếp nhận.`, 'info');
    setSelectedOrderForReassignOSA(null);
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/order-management') return { parent: 'Chăm sóc khách hàng', page: 'Quản lý đơn hàng' };
    if (path === '/rescue-supervision') return { parent: 'Giám sát cứu hộ', page: 'Giám sát' };
    if (path === '/active-support') return { parent: 'Giám sát cứu hộ', page: 'Đang hỗ trợ' };
    return { parent: 'Hệ thống', page: 'Trang chủ' };
  };

  const OrderDetailWrapper = () => {
    const { id } = useParams();
    const order = orders.find(o => o.id === id);
    if (!order) return <Navigate to="/order-management" />;
    return <OrderDetail order={order} initialEditMode={detailEditMode} scrollToId={scrollTarget} onBack={() => { setScrollTarget(null); navigate('/order-management'); }} onSave={(updated) => setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} userRole={userRole} currentUser={currentUser} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
            <h1 className="text-[15px] font-bold text-slate-800 uppercase tracking-tight">VETC - CỔNG THÔNG TIN DÀNH CHO ĐẠI LÝ</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button onClick={() => handleRoleSwitch('CSKH')} className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${userRole === 'CSKH' ? 'bg-[#00a651] text-white shadow-md' : 'text-slate-400'}`}>CSKH</button>
              <button onClick={() => handleRoleSwitch('OSA')} className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${userRole === 'OSA' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>OSA</button>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg">
               <span className="text-xs font-bold text-slate-700">{currentUser}</span>
            </div>
          </div>
        </header>
        <div className="bg-[#00a651] px-6 py-2.5 flex items-center justify-between text-white text-[12px] font-medium shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="opacity-80 uppercase font-bold">{getBreadcrumbs().parent}</span><span>&gt;</span><span className="font-bold uppercase">{getBreadcrumbs().page}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold"><span>{currentTimeStr.split(' ')[0]}</span></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <Routes>
            <Route path="/" element={<Navigate to="/order-management" />} />
            <Route path="/order-management" element={<OrderManagement filters={filters} onFilterChange={handleFilterChange} onSearch={applyFilters} onMySupport={handleMySupport} onNotSupported={handleNotSupported} onClear={handleClearFilters} userRole={userRole} filteredOrders={filteredOrders} onVerifyClick={handleVerifyClick} onDetailClick={handleCoordinationClick} onSupportClick={setSelectedOrderForSupport} onAssignClick={setSelectedOrderForAssign} onReassignOSA={setSelectedOrderForReassignOSA} currentUser={currentUser} />} />
            <Route path="/rescue-supervision" element={<RescueSupervision orders={supervisionOrders} notifications={notifications} onAcceptSupport={setConfirmSupportOrder} />} />
            <Route path="/active-support" element={<ActiveSupport orders={supervisionOrders} onAcceptSupport={setConfirmSupportOrder} onReassignOSA={setSelectedOrderForReassignOSA} userRole={userRole} />} />
            <Route path="/order-detail/:id" element={<OrderDetailWrapper />} />
          </Routes>
        </div>

        {/* NOTIFICATION CENTER (The Floating System) */}
        <NotificationCenter 
          notifications={notifications} 
          onCloseNotification={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))}
          onClearAll={() => setNotifications([])}
        />
      </main>

      {/* Modals */}
      {selectedOrderForSupport && <SupportConfirmModal order={{ ...selectedOrderForSupport, customerName: selectedOrderForSupport.customer.name, phone: selectedOrderForSupport.customer.phone, plate: selectedOrderForSupport.vehicle.plate, location: selectedOrderForSupport.address, services: selectedOrderForSupport.service, waitTime: '0p', status: 'Searching' }} onClose={() => setSelectedOrderForSupport(null)} onConfirm={() => handleAssignConfirm(selectedOrderForSupport.id, currentUser)} />}
      {selectedOrderForAssign && <AssignModal order={selectedOrderForAssign} onClose={() => setSelectedOrderForAssign(null)} onConfirm={(uid) => handleAssignConfirm(selectedOrderForAssign.id, uid)} currentUser={currentUser} />}
      {selectedOrderForVerify && <VerifyModal order={selectedOrderForVerify} onClose={() => setSelectedOrderForVerify(null)} onConfirm={handleVerifyConfirm} />}
      {selectedOrderForReassignOSA && <ReassignOSAModal order={selectedOrderForReassignOSA} onClose={() => setSelectedOrderForReassignOSA(null)} onConfirm={handleReassignOSAConfirm} currentUser={currentUser} />}
      {confirmSupportOrder && <SupportConfirmModal order={confirmSupportOrder} onClose={() => setConfirmSupportOrder(null)} onConfirm={() => {}} />}
    </div>
  );
};

export default App;
