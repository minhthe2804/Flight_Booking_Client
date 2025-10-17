import { path } from './path'
import { faHouse, faCalendar, faMagnifyingGlass, faGift } from '@fortawesome/free-solid-svg-icons'

export const navHeader = [
  {
    name: 'Trang chủ',
    path: path.home,
    icon: faHouse
  },
  {
    name: 'Đặt chỗ của bạn',
    path: path.reservation,
    icon: faCalendar
  },
  {
    name: 'Tra cứu',
    path: path.lookup,
    icon: faMagnifyingGlass
  },
  {
    name: 'Thông tin khuyến mãi',
    path: path.promotion,
    icon: faGift
  }
]
