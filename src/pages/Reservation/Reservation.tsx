import { useState } from 'react'
import { faInfo, faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Paginate from '~/components/Pagination'
import CancelBookingModal from './components/CancelBookingModal'

export default function Reservation() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleCancelBooking = () => {
        setIsModalOpen(true)
    }

    const handleSubmitCancellation = (data: any) => {
        console.log('Cancellation submitted:', data)
    }

    const bookings = [
        {
            id: 90,
            time: '13:24:55 18/1/2025',
            route: 'Hà Nội → TP. Hồ Chí Minh',
            avgPrice: 0,
            finalPrice: 4,
            status: 'Đã thanh toán'
        },
        {
            id: 89,
            time: '13:24:55 18/1/2025',
            route: 'Hà Nội → TP. Hồ Chí Minh',
            avgPrice: 0,
            finalPrice: 2,
            status: 'Đã thanh toán'
        },
        {
            id: 87,
            time: '12:21:16 18/1/2025',
            route: 'Hà Nội → TP. Hồ Chí Minh → Hà Nội',
            avgPrice: 0,
            finalPrice: 2,
            status: 'Đã thanh toán'
        },
        {
            id: 86,
            time: '12:21:16 18/1/2025',
            route: 'Hà Nội → TP. Hồ Chí Minh',
            avgPrice: 0,
            finalPrice: 1,
            status: 'Đã thanh toán'
        },
        {
            id: 85,
            time: '12:21:16 18/1/2025',
            route: 'Hà Nội → TP. Hồ Chí Minh',
            avgPrice: 0,
            finalPrice: 1,
            status: 'Đã thanh toán'
        }
    ]
    return (
        <div>
            <div className='max-w-[1278px] mx-auto'>
                <h1 className='text-[24px] text-black text-center mt-4 font-semibold'>Dach sách đặt chỗ</h1>
                <div className='grid grid-cols-12 mt-5 gap-6'>
                    <div className='col-span-4'>
                        <div className='w-full h-[100px] rounded border border-[#cdcdcd] bg-slate-100 py-2 pl-4 font-semibold'>
                            <p className='text-[18px]'>Tổng đặt chỗ</p>
                            <b className='text-[30px] font-medium'>37</b>
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <div className='w-full h-[100px] rounded border border-[#cdcdcd] bg-slate-100 py-2 pl-4 font-semibold'>
                            <p className='text-[18px]'>Số vé hạng thương gia</p>
                            <b className='text-[30px] font-medium'>27</b>
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <div className='w-full h-[100px] rounded border border-[#cdcdcd] bg-slate-100 py-2 pl-4 font-semibold'>
                            <p className='text-[18px]'>Số vé hạng phổ thông</p>
                            <b className='text-[30px] font-medium'>33</b>
                        </div>
                    </div>
                </div>

                <div className='rounded border border-[#cdcdcd] pb-8 pt-4 px-4 mt-5'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2 text-gray-700'>
                            <span className='text-[16px] font-medium'>Hiển thị</span>
                            <select className='border border-gray-300 rounded px-2 py-1 text-[13px] outline-none'>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                            <span className='text-[16px] font-medium'>bản ghi</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <label className='text-[16px] text-gray-700 font-medium'>Tìm kiếm:</label>
                            <input
                                type='text'
                                className='border border-gray-300 rounded px-3 py-[6px] text-sm outline-none text-[18px] text-black w-[200px]'
                            />
                        </div>
                    </div>

                    <table className='w-full text-left border-collapse mt-2'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Mã đặt chỗ <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Ngày mua <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Thông tin đặt chỗ{' '}
                                    <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Ghế thương gia <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Ghế phổ thông <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Trạng thái <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-lg font-semibold text-black'>
                                    Chi tiết <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className={'hover:bg-slate-200 transtion duration-100 ease-in'}>
                                    <td className='pl-2 py-4 border-b border-gray-200 text-base cursor-pointer'>
                                        {booking.id}
                                    </td>
                                    <td className='pl-2 py-4 border-b border-gray-200 text-base cursor-pointer'>
                                        {booking.time}
                                    </td>
                                    <td className='pl-2 py-4 border-b border-gray-200 text-base cursor-pointer'>
                                        {booking.route}
                                    </td>
                                    <td className='pl-2 py-4 border-b border-gray-200 text-base cursor-pointer'>
                                        {booking.avgPrice}
                                    </td>
                                    <td className='pl-2 py-4 border-b border-gray-200 text-base cursor-pointer'>
                                        {booking.finalPrice}
                                    </td>
                                    <td className='pl-2 py-4 border-b border-gray-200 text-base cursor-pointer'>
                                        <button className='bg-green-600 text-white px-2 py-1 rounded-lg text-[12px] flex items-center font-medium'>
                                            {booking.status}
                                        </button>
                                    </td>
                                    <td className='p-2 border-b border-gray-200 text-sm cursor-pointer'>
                                        <button
                                            className='px-[4px] py-[6px] rounded text-xs flex items-center border border-neutral-700'
                                            onClick={() => handleCancelBooking()}
                                        >
                                            <FontAwesomeIcon
                                                icon={faInfo}
                                                className='text-[10px] border text-black p-[2px] border-neutral-700 rounded'
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-between items-center mt-4 text-gray-700 text-sm'>
                        <span className='text-[16px] font-medium'>Hiển thị 1 đến 5 trong 36 bản ghi</span>
                        <Paginate pageSize={4} key={''} queryConfig={''} />
                    </div>
                </div>
            </div>
            {/* Cancel Booking Modal */}
            <CancelBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitCancellation}
            />
        </div>
    )
}
