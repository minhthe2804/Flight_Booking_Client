import { NavLink } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'
import { path } from '~/constants/path'

export default function FlightBooking() {
    return (
        <div className='bg-gray-50 min-h-screen pb-20'>
            <div className='max-w-[1278px] mx-auto px-4'>
                {/* --- THANH TIẾN TRÌNH (STEPPER) --- */}
                <div className='w-full flex items-center mt-8 gap-3 mb-8'>
                    {/* STEP 1: Chi tiết */}
                    <div className='shrink-0'>
                        <NavLink to={path.flightBookingDetail} className='flex items-center gap-2'>
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-center text-white text-sm transition-colors duration-200 ${
                                            isActive ? 'bg-[#007bff]' : 'bg-slate-400'
                                        }`}
                                    >
                                        <p className='mt-[-1px]'>1</p>
                                    </div>
                                    <p
                                        className={`text-base font-semibold transition-colors duration-200 ${
                                            isActive ? 'text-[#007bff]' : 'text-black'
                                        }`}
                                    >
                                        Chi tiết chuyến đi của bạn
                                    </p>
                                </>
                            )}
                        </NavLink>
                    </div>

                    {/* Đường kẻ nối (Dùng flex-1 để tự co giãn thay vì fix cứng pixel) */}
                    <div className='mt-1 flex-1 h-[2px] bg-[#cdcdcd]' />

                    {/* STEP 2: Thanh toán */}
                    <div className='shrink-0'>
                        <NavLink to={path.flightBookingPayment} className='flex items-center gap-2'>
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-center text-white text-sm transition-colors duration-200 ${
                                            isActive ? 'bg-[#007bff]' : 'bg-slate-400'
                                        }`}
                                    >
                                        <p className='mt-[-1px]'>2</p>
                                    </div>
                                    <p
                                        className={`text-base font-semibold transition-colors duration-200 ${
                                            isActive ? 'text-[#007bff]' : 'text-black'
                                        }`}
                                    >
                                        Thanh toán
                                    </p>
                                </>
                            )}
                        </NavLink>
                    </div>
                </div>

                {/* Nội dung trang con (Chi tiết hoặc Thanh toán) */}
                <Outlet />
            </div>
        </div>
    )
}
