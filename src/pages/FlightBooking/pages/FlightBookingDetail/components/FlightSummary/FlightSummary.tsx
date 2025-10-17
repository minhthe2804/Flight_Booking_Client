import { faPlane, faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FlightSummary() {
    return (
        <div>
            <div className='bg-white rounded-lg shadow border-2 border-gray-200 w-full flex flex-col max-h-[90vh]'>
                {/* --- PHẦN NỘI DUNG CÓ THỂ CUỘN --- */}
                <div className='flex-grow overflow-y-auto p-6'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-800'>Tóm tắt chuyến bay</h2>

                    {/* --- Khối Chuyến bay --- */}
                    <div className='border-b border-gray-200 pb-4'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='font-semibold text-gray-700'>Chuyến bay</h3>
                            <span className='bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center'>
                                ✈️ Bay thẳng
                            </span>
                        </div>

                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='font-bold text-lg text-gray-900'>Hà Nội</p>
                                <p className='text-sm text-gray-500 font-semibold'>Th 6, 24 thg 1</p>
                                <p className='text-sm text-gray-500 font-semibold'>2025 04:40</p>
                            </div>
                            <div className='text-center text-gray-500 px-2'>
                                <p className='text-xs'>1h 0m</p>
                                <div className='relative my-1 w-16'>
                                    <hr className='border-t border-gray-300' />
                                    <FontAwesomeIcon
                                        icon={faPlane}
                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 bg-white px-1'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p className='font-bold text-lg text-gray-900'>TP. Hồ Chí Minh</p>
                                <p className='text-sm text-gray-500 font-semibold'>Th 6, 24 thg 1</p>
                                <p className='text-sm text-gray-500 font-semibold'>2025 05:40</p>
                            </div>
                        </div>

                        <div className='bg-slate-100 p-4'>
                            <div className='text-sm text-gray-600 flex justify-center'>
                                <div className='flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faPlaneUp} className='text-sm text-blue-500' />
                                    <div className='flex items-center gap-2'>
                                        <b> Vietjet Air</b>
                                        <p className=''>|</p>
                                        <p className='font-medium'>VJ00000</p>
                                        <p>|</p>
                                    </div>
                                    <div className='font-semibold bg-slate-500 text-white rounded-[6px] px-1 py-0.5 text-xs w-[36px] flex justify-center items-center'>
                                        ECO
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-between text-sm mt-5 px-4'>
                                <div className='flex flex-col items-center justify-center'>
                                    <p className=' text-gray-500 font-medium'>Cất cánh</p>
                                    <p className='text-gray-800 font-bold text-base'>04:40</p>
                                </div>
                                <div className='flex flex-col items-center justify-center'>
                                    <p className=' text-gray-500 font-medium'>Hạ cánh</p>
                                    <p className='text-gray-800 font-bold text-base'>05:40</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Khối Giá gói --- */}
                    <div className='flex justify-between items-center mt-4'>
                        <span className='font-semibold text-gray-700'>Giá gói:</span>
                        <div>
                            <span className='bg-blue-100 text-blue-700 font-semibold px-3 py-2 rounded-md text-sm'>
                                Economy Class
                            </span>
                            <span className='ml-4 font-bold text-lg text-gray-900'>
                                2.500.000 <span className='text-sm align-top'>₫</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-4 border-2 border-gray-200 bg-white rounded-md mt-4 shadow'>
                <h3 className=' text-gray-500 text-sm font-medium'>Chi tiết số lượng hành khách:</h3>
                <div className='flex justify-between text-gray-700 text-sm'>
                    <span className='text-base font-semibold'>Người lớn: 3</span>
                </div>
                <div className='flex justify-between items-center mt-2 pt-2 border-t border-gray-200 w-full'>
                    <span className='font-semibold text-gray-800'>Tổng tiền cho 3 hành khách:</span>
                    <span className='font-semibold text-xl text-orange-500'>
                        7.500.000 <span className='text-base align-top'>₫</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
