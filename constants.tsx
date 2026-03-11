
import { Order, SupervisionOrder } from './types';

export const STATUS_MAPPING: Record<string, string[]> = {
  'INITIAL': ['WAITING_PAYMENT', 'WAITING_CONFIRM'],
  'CONFIRMED': ['CONFIRMED'],
  'ASSIGNING': [
    'WAITING_PROVIDER_ACCEPT', 'PROVIDER_ACCEPTED', 'PROVIDER_REJECTED', 
    'PROVIDER_TIMEOUT', 'WAITING_DRIVER_ACCEPT', 'DRIVER_ACCEPTED', 
    'DRIVER_REJECTED', 'DRIVER_TIMEOUT'
  ],
  'IN_PROGRESS': ['DRIVER_ON_THE_WAY', 'RESCUE_IN_PROGRESS', 'RESCUE_COMPLETED_BY_DRIVER'],
  'COMPLETED': [
    'COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_DRIVER', 
    'CANCELLED_BY_PROVIDER', 'CANCELLED_BY_SYSTEM'
  ],
  'FAILED': ['FAILED_NO_PROVIDER', 'FAILED_NO_DRIVER', 'FAILED_TIMEOUT', 'FAILED_SYSTEM_ERROR']
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  'WAITING_PAYMENT': 'Chờ thanh toán',
  'WAITING_CONFIRM': 'Chờ xác nhận',
  'CONFIRMED': 'Đã xác nhận',
  'WAITING_PROVIDER_ACCEPT': 'Chờ đối tác tiếp nhận',
  'PROVIDER_ACCEPTED': 'Đối tác đã tiếp nhận',
  'PROVIDER_REJECTED': 'Đối tác từ chối',
  'PROVIDER_TIMEOUT': 'Đối tác quá hạn',
  'WAITING_DRIVER_ACCEPT': 'Chờ tài xế tiếp nhận',
  'DRIVER_ACCEPTED': 'Tài xế đã tiếp nhận',
  'DRIVER_REJECTED': 'Tài xế từ chối',
  'DRIVER_TIMEOUT': 'Tài xế quá hạn',
  'DRIVER_ON_THE_WAY': 'Tài xế đang đến',
  'RESCUE_IN_PROGRESS': 'Đang thực hiện cứu hộ',
  'RESCUE_COMPLETED_BY_DRIVER': 'Hoàn thành bởi tài xế',
  'COMPLETED': 'Hoàn thành',
  'CANCELLED_BY_CUSTOMER': 'Khách hủy',
  'CANCELLED_BY_DRIVER': 'Tài xế hủy',
  'CANCELLED_BY_PROVIDER': 'Đối tác hủy',
  'CANCELLED_BY_SYSTEM': 'Hệ thống hủy',
  'FAILED_NO_PROVIDER': 'Thất bại (Không tìm thấy đối tác)',
  'FAILED_NO_DRIVER': 'Thất bại (Không tìm thấy tài xế)',
  'FAILED_TIMEOUT': 'Thất bại (Quá hạn)',
  'FAILED_SYSTEM_ERROR': 'Lỗi hệ thống'
};

const createMockOrder = (id: string, code: string, reqStatus: string, orderStatus: string, name: string, phone: string, plate: string, brand: string, model: string, address: string, cskh: string = '---', osa: string = '---'): Order => ({
  id,
  orderCode: code,
  service: ['Kích bình ắc quy'],
  quantity: 1,
  providerFee: 0,
  requestStatus: reqStatus,
  orderStatus: orderStatus,
  verificationStatus: 'Chờ xác minh',
  customer: { name, phone },
  vehicle: { plate, brand, model },
  address,
  createdAt: '02/02/2026 - 10:00:00',
  createdBy: 'system',
  updatedAt: '',
  updatedBy: '---',
  cskhName: cskh,
  osaName: osa,
  typeBadge: 'Đơn lẻ',
  sourceBadge: 'PORTAL'
});

export const MOCK_ORDERS: Order[] = [
  // INITIAL
  createMockOrder('wp-1', 'RS-WP-001', 'WAITING_PAYMENT', 'INITIAL', 'Nguyễn Văn A', '0901234567', '30K-111.11', 'Toyota', 'Vios', 'Hoàn Kiếm, Hà Nội', 'rsa_test1', 'rsa_test1'),
  createMockOrder('wp-2', 'RS-WP-002', 'WAITING_PAYMENT', 'INITIAL', 'Trần Thị B', '0902234567', '30K-222.22', 'Honda', 'City', 'Đống Đa, Hà Nội'),
  createMockOrder('wc-1', 'RS-WC-001', 'WAITING_CONFIRM', 'INITIAL', 'Lê Văn C', '0903234567', '30K-333.33', 'Mazda', '3', 'Hai Bà Trưng, Hà Nội'),
  createMockOrder('wc-2', 'RS-WC-002', 'WAITING_CONFIRM', 'INITIAL', 'Phạm Thị D', '0904234567', '30K-444.44', 'Kia', 'Cerato', 'Thanh Xuân, Hà Nội'),

  // CONFIRMED
  createMockOrder('cf-1', 'RS-CF-001', 'CONFIRMED', 'CONFIRMED', 'Hoàng Văn E', '0905234567', '30K-555.55', 'Hyundai', 'Accent', 'Cầu Giấy, Hà Nội', 'rsa_test1', 'rsa_test1'),
  createMockOrder('cf-2', 'RS-CF-002', 'CONFIRMED', 'CONFIRMED', 'Đặng Thị F', '0906234567', '30K-666.66', 'Ford', 'Ranger', 'Tây Hồ, Hà Nội', 'rsa_test1', 'rsa_test1'),

  // ASSIGNING
  createMockOrder('wpa-1', 'RS-WPA-001', 'WAITING_PROVIDER_ACCEPT', 'ASSIGNING', 'Bùi Văn G', '0907234567', '30K-777.77', 'Mitsubishi', 'Xpander', 'Long Biên, Hà Nội'),
  createMockOrder('wpa-2', 'RS-WPA-002', 'WAITING_PROVIDER_ACCEPT', 'ASSIGNING', 'Ngô Thị H', '0908234567', '30K-888.88', 'Suzuki', 'XL7', 'Gia Lâm, Hà Nội', 'rsa_test1', 'rsa_test1'),
  createMockOrder('pa-1', 'RS-PA-001', 'PROVIDER_ACCEPTED', 'ASSIGNING', 'Lý Văn I', '0909234567', '30K-999.99', 'VinFast', 'VF8', 'Hà Đông, Hà Nội', 'admin', 'admin'),
  createMockOrder('pa-2', 'RS-PA-002', 'PROVIDER_ACCEPTED', 'ASSIGNING', 'Vũ Thị K', '0910234567', '29A-111.11', 'VinFast', 'VFe34', 'Nam Từ Liêm, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('pr-1', 'RS-PR-001', 'PROVIDER_REJECTED', 'ASSIGNING', 'Đỗ Văn L', '0911234567', '29A-222.22', 'Mercedes', 'C200', 'Bắc Từ Liêm, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('pt-1', 'RS-PT-001', 'PROVIDER_TIMEOUT', 'ASSIGNING', 'Trịnh Thị M', '0912234567', '29A-333.33', 'BMW', '320i', 'Hoàng Mai, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('wda-1', 'RS-WDA-001', 'WAITING_DRIVER_ACCEPT', 'ASSIGNING', 'Mai Văn N', '0913234567', '29A-444.44', 'Audi', 'A4', 'Thanh Trì, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('da-1', 'RS-DA-001', 'DRIVER_ACCEPTED', 'ASSIGNING', 'Đào Thị O', '0914234567', '29A-555.55', 'Lexus', 'RX350', 'Sóc Sơn, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('dr-1', 'RS-DR-001', 'DRIVER_REJECTED', 'ASSIGNING', 'Phùng Văn P', '0915234567', '29A-666.66', 'Volvo', 'XC60', 'Đông Anh, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('dt-1', 'RS-DT-001', 'DRIVER_TIMEOUT', 'ASSIGNING', 'Hồ Thị Q', '0916234567', '29A-777.77', 'Porsche', 'Macan', 'Mê Linh, Hà Nội', 'rsa_test1', 'rsa_test2'),

  // IN_PROGRESS
  createMockOrder('dotw-1', 'RS-DOTW-001', 'DRIVER_ON_THE_WAY', 'IN_PROGRESS', 'Thân Văn R', '0917234567', '29A-888.88', 'Peugeot', '3008', 'Thạch Thất, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('rip-1', 'RS-RIP-001', 'RESCUE_IN_PROGRESS', 'IN_PROGRESS', 'Khuất Thị S', '0918234567', '29A-999.99', 'Land Rover', 'Defender', 'Quốc Oai, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('rcbd-1', 'RS-RCBD-001', 'RESCUE_COMPLETED_BY_DRIVER', 'IN_PROGRESS', 'Tạ Văn T', '0919234567', '31A-111.11', 'Jeep', 'Wrangler', 'Đan Phượng, Hà Nội', 'rsa_test1', 'rsa_test2'),

  // COMPLETED
  createMockOrder('comp-1', 'RS-COMP-001', 'COMPLETED', 'COMPLETED', 'Vi Văn U', '0920234567', '31A-222.22', 'Subaru', 'Forester', 'Hoài Đức, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('cbc-1', 'RS-CBC-001', 'CANCELLED_BY_CUSTOMER', 'COMPLETED', 'Nông Thị V', '0921234567', '31A-333.33', 'Volkswagen', 'Tiguan', 'Phúc Thọ, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('cbd-1', 'RS-CBD-001', 'CANCELLED_BY_DRIVER', 'COMPLETED', 'Lương Văn W', '0922234567', '31A-444.44', 'Isuzu', 'mu-X', 'Sơn Tây, Hà Nội', 'rsa_test1', 'rsa_test4'),
  createMockOrder('cbp-1', 'RS-CBP-001', 'CANCELLED_BY_PROVIDER', 'COMPLETED', 'Dương Thị X', '0923234567', '31A-555.55', 'Nissan', 'Navara', 'Ba Vì, Hà Nội', 'rsa_test1', 'rsa_test4'),
  createMockOrder('cbs-1', 'RS-CBS-001', 'CANCELLED_BY_SYSTEM', 'COMPLETED', 'Chu Văn Y', '0924234567', '31A-666.66', 'Chevrolet', 'Colorado', 'Ứng Hòa, Hà Nội', 'rsa_test1', 'rsa_test3'),

  // FAILED
  createMockOrder('fnp-1', 'RS-FNP-001', 'FAILED_NO_PROVIDER', 'FAILED', 'Kiều Thị Z', '0925234567', '31A-777.77', 'SsangYong', 'Tivoli', 'Mỹ Đức, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('fnd-1', 'RS-FND-001', 'FAILED_NO_DRIVER', 'FAILED', 'Triệu Văn AA', '0926234567', '31A-888.88', 'MG', 'ZS', 'Phú Xuyên, Hà Nội', 'rsa_test1', 'rsa_test2'),
  createMockOrder('ft-1', 'RS-FT-001', 'FAILED_TIMEOUT', 'FAILED', 'La Thị BB', '0927234567', '31A-999.99', 'Baic', 'Beijing X7', 'Thường Tín, Hà Nội', 'rsa_test1', 'rsa_test3'),
  createMockOrder('fse-1', 'RS-FSE-001', 'FAILED_SYSTEM_ERROR', 'FAILED', 'Lù Văn CC', '0928234567', '30H-111.11', 'Zotye', 'Z8', 'Thanh Oai, Hà Nội', 'rsa_test1', 'rsa_test3'),
];

export const MOCK_SUPERVISION_DATA: SupervisionOrder[] = [
  {
    id: 's1',
    orderCode: '38A58531...8412',
    fullCode: 'RS-38A58531-260202-8412',
    customerName: 'NGUYỄN VĂN A',
    phone: '0912345678',
    plate: '29A-123.45',
    vehicleModel: 'MAZDA CX-5',
    location: 'Đường Nguyễn Văn Cừ, Long Biên, Hà Nội',
    services: ['Kích bình ắc quy'],
    waitTime: '8p 19s',
    status: 'Searching',
    isInActiveSupport: false
  },
  {
    id: 's2',
    orderCode: '29K12345...9999',
    fullCode: 'RS-29K12345-260202-9999',
    customerName: 'TRẦN THỊ B',
    phone: '0988777666',
    plate: '30L-999.88',
    vehicleModel: 'KIA SELTOS',
    location: 'Cầu Nhật Tân, Tây Hồ, Hà Nội',
    services: ['Cứu hộ kéo xe'],
    waitTime: '12p 45s',
    status: 'NoStation',
    isInActiveSupport: false
  }
];
