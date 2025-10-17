import { Link, Outlet } from 'react-router-dom'
import { path } from '~/constants/path'

export default function FlightBooking() {
    return (
        <div>
            <div className='max-w-[1278px] mx-auto'>
                <div className='w-full flex items-center mt-8 gap-3'>
                    <div className=''>
                        <Link to={path.flightBookingDetail} className='flex items-center gap-2'>
                            <div className='w-6 h-6 rounded-full flex items-center justify-center text-center bg-[#007bff] text-white text-sm'>
                                <p className='mt-[-1px]'> 1</p>
                            </div>
                            <p className='text-base font-semibold text-[#007bff]'>Chi tiết chuyến đi của bạn</p>
                        </Link>
                    </div>
                    <div className='mt-1 w-[918px] h-[2px] bg-[#cdcdcd]' />
                    <div className=''>
                        <Link to={path.flightBookingPayment} className='flex items-center gap-2'>
                            <div className='w-6 h-6 rounded-full flex items-center justify-center text-center bg-slate-400 text-white text-sm'>
                                <p className='mt-[-1px]'> 2</p>
                            </div>
                            <p className='text-base font-semibold text-black'>Thanh toán</p>
                        </Link>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
