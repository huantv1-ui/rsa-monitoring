
export type OrderStatusKey = 'INITIAL' | 'CONFIRMED' | 'ASSIGNING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'Tất cả';

export type AppView = 'ORDER_MANAGEMENT' | 'RESCUE_SUPERVISION' | 'ACTIVE_SUPPORT' | 'ORDER_DETAIL';
export type UserRole = 'CSKH' | 'OSA';

export type VerificationStatus = 'Đã xác minh' | 'Không đạt' | 'Chờ xác minh';

export interface Notification {
  id: string;
  type: 'emergency' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  orderId?: string;
  isRead: boolean;
}

export interface Order {
  id: string;
  orderCode: string;
  service: string[];
  quantity: number;
  providerFee: number;
  requestStatus: string;
  orderStatus: string;
  verificationStatus?: VerificationStatus;
  customer: {
    name: string;
    phone: string;
  };
  vehicle: {
    plate: string;
    brand: string;
    model: string;
  };
  address: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  cskhName?: string;
  osaName?: string;
  typeBadge: 'Đơn lẻ' | 'Đơn gói';
  sourceBadge: 'PORTAL' | 'ECOM';
  supportPartner?: string;
  driver?: {
    name: string;
    phone: string;
  };
  partnerVehicle?: {
    plate: string;
    brand: string;
    model: string;
  };
  rescueStation?: string;
  stationAddress?: string;
  towToLocation?: string;
}

export interface SupervisionOrder {
  id: string;
  orderCode: string;
  fullCode?: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicleModel?: string;
  location: string;
  services: string[];
  waitTime: string;
  status: 'Searching' | 'NoStation' | 'Assigned' | 'Expired' | 'MissingInfo' | 'SearchingPartner' | 'Repairing' | 'WaitingConfirm';
  verificationStatus?: VerificationStatus;
  isUrgent?: boolean;
  isInActiveSupport?: boolean;
}

export interface SupervisionFilterState {
  status: string;
  location: string;
  waitFrom: string;
  waitTo: string;
}

export interface FilterState {
  orderCode: string;
  phone: string;
  plate: string;
  service: string;
  partner: string;
  tollStation: string;
  orderStatus: string[]; 
  requestStatus: string[];
  verificationStatus: string; // New filter
  supporter: string;
  fromDate: string;
  toDate: string;
}
