import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatCurrency } from '~/utils/utils'

export default function Promotion() {
    return (
        <div>
            <div className='max-w-[1278px] mx-auto'>
                <h1 className='text-[24px] text-black text-center mt-4'>Thông tin khuyến mãi</h1>
                <div className='grid grid-cols-12 mt-5 gap-5'>
                    {/*  */}
                    <div className='col-span-3'>
                        <div className='rounded-[20px] w-full h-[500px] shadow-md'>
                            <div className='w-full h-[120px] rounded-t-[20px] line-gr bg-gradient-to-r from-[#9796f0] to-[#fbc7d4] flex items-center justify-center'>
                                <div className='w-[120px] h-[60px] rounded-[20px] bg-white flex flex-col items-center justify-center'>
                                    <p className='text-[13px] text-[#807f7f]'>Giảm</p>
                                    <b className='text-[18px]'>{formatCurrency(100000)}</b>
                                </div>
                            </div>
                            <div className='px-5 mt-4'>
                                <h2 className='text-[15px] font-semibold'>Bay vui quốc tế</h2>
                                <p className='text-[15px] text-[#807f7f] mt-1 font-semibold'>
                                    Ưu đãi lớn cho chuyến bay quốc tế
                                </p>
                                <div className='rounded-[20px] w-full h-[60px] flex items-center justify-center bg-slate-100 mt-5 gap-1'>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#9b9595]'>Bắt đầu</p>
                                        <b className='text-[14px] font-semibold'>01/01/2025</b>
                                    </div>
                                    <div className='rotate-90 w-[40px] h-[1px] bg-[#cdcdcd]'></div>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#8d8787]'>Kết thúc</p>
                                        <b className='text-[14px] font-semibold'>30/09/2025</b>
                                    </div>
                                </div>
                                <div className='rounded-[20px] w-full h-[90px] px-4 pt-2 bg-slate-100 mt-4'>
                                    <p className='text-[12px] text-[#9b9595]'>Mã khuyến mãi</p>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-[180px] h-[40px] border border-[#e9e5e5] rounded-[10px] bg-white mt-1 p-2'>
                                            <p className='text-[15px] text-black font-semibold'>QUOCTE</p>
                                        </div>
                                        <div className='w-[35px] h-[30px] bg-slate-500 rounded-md text-center text-white flex items-center justify-center cursor-pointer group hover:bg-slate-400 transtion duration-200 ease-in-out'>
                                            <FontAwesomeIcon
                                                icon={faCopy}
                                                className='group-hover:opacity-85 transtion duration-200 ease-in-out'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 w-full mt-4'>
                                    <div className='flex items-center justify-center w-1/2 h-7 rounded-full bg-slate-300'>
                                        <p className='text-[12px]'>American Airlines</p>
                                    </div>
                                    <div className='flex items-center justify-center w-1/2 h-7 rounded-full bg-slate-300'>
                                        <p className='text-[12px]'>VietNam Airlines</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className='col-span-3'>
                        <div className='rounded-[20px] w-full h-[500px] shadow-md'>
                            <div className='w-full h-[120px] rounded-t-[20px] line-gr bg-gradient-to-r from-[#acb6e5] to-[#86fde8] flex items-center justify-center'>
                                <div className='w-[120px] h-[60px] rounded-[20px] bg-white flex flex-col items-center justify-center'>
                                    <p className='text-[13px] text-[#807f7f]'>Giảm</p>
                                    <b className='text-[18px]'>{formatCurrency(200000)}</b>
                                </div>
                            </div>
                            <div className='px-5 mt-4'>
                                <h2 className='text-[15px] font-semibold'>Mùa du lịch</h2>
                                <p className='text-[15px] text-[#807f7f] mt-1 font-semibold'>
                                    Giảm giá cho các chuyến bay đường dài
                                </p>
                                <div className='rounded-[20px] w-full h-[60px] flex items-center justify-center bg-slate-100 mt-5 gap-1'>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#9b9595]'>Bắt đầu</p>
                                        <b className='text-[14px] font-semibold'>01/01/2025</b>
                                    </div>
                                    <div className='rotate-90 w-[40px] h-[1px] bg-[#cdcdcd]'></div>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#8d8787]'>Kết thúc</p>
                                        <b className='text-[14px] font-semibold'>31/07/2025</b>
                                    </div>
                                </div>
                                <div className='rounded-[20px] w-full h-[90px] px-4 pt-2 bg-slate-100 mt-4'>
                                    <p className='text-[12px] text-[#9b9595]'>Mã khuyến mãi</p>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-[180px] h-[40px] border border-[#e9e5e5] rounded-[10px] bg-white mt-1 p-2'>
                                            <p className='text-[15px] text-black font-semibold'>TRAVEL</p>
                                        </div>
                                        <div className='w-[35px] h-[30px] bg-slate-500 rounded-md text-center text-white flex items-center justify-center cursor-pointer group hover:bg-slate-400 transtion duration-200 ease-in-out'>
                                            <FontAwesomeIcon
                                                icon={faCopy}
                                                className='group-hover:opacity-85 transtion duration-200 ease-in-out'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 w-full mt-4'>
                                    <div className='flex items-center justify-center w-1/2 h-7 rounded-full bg-slate-300'>
                                        <p className='text-[12px]'>Vietjet Air</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className='col-span-3'>
                        <div className='rounded-[20px] w-full h-[500px] shadow-md'>
                            <div className='w-full h-[120px] rounded-t-[20px] line-gr bg-gradient-to-r from-[#74ebd5] to-[#ACB6E5] flex items-center justify-center'>
                                <div className='w-[120px] h-[60px] rounded-[20px] bg-white flex flex-col items-center justify-center'>
                                    <p className='text-[13px] text-[#807f7f]'>Giảm</p>
                                    <b className='text-[18px]'>4%</b>
                                </div>
                            </div>
                            <div className='px-5 mt-4'>
                                <h2 className='text-[15px] font-semibold'>Khuyến mãi đặc biệt</h2>
                                <p className='text-[15px] text-[#807f7f] mt-1 font-semibold'>
                                    Ưu đãi cho khách hàng đã có tài khoản
                                </p>
                                <div className='rounded-[20px] w-full h-[60px] flex items-center justify-center bg-slate-100 mt-5 gap-1'>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#9b9595]'>Bắt đầu</p>
                                        <b className='text-[14px] font-semibold'>01/01/2025</b>
                                    </div>
                                    <div className='rotate-90 w-[40px] h-[1px] bg-[#cdcdcd]'></div>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#8d8787]'>Kết thúc</p>
                                        <b className='text-[14px] font-semibold'>31/03/2025</b>
                                    </div>
                                </div>
                                <div className='rounded-[20px] w-full h-[90px] px-4 pt-2 bg-slate-100 mt-4'>
                                    <p className='text-[12px] text-[#9b9595]'>Mã khuyến mãi</p>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-[180px] h-[40px] border border-[#e9e5e5] rounded-[10px] bg-white mt-1 p-2'>
                                            <p className='text-[15px] text-black font-semibold'>VIPSALE</p>
                                        </div>
                                        <div className='w-[35px] h-[30px] bg-slate-500 rounded-md text-center text-white flex items-center justify-center cursor-pointer group hover:bg-slate-400 transtion duration-200 ease-in-out'>
                                            <FontAwesomeIcon
                                                icon={faCopy}
                                                className='group-hover:opacity-85 transtion duration-200 ease-in-out'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 w-full mt-4 flex-wrap'>
                                    <div className='flex items-center justify-center w-1/2 h-7 rounded-full bg-slate-300'>
                                        <p className='text-[12px]'>Bamboo Airways</p>
                                    </div>
                                    <div className='flex items-center justify-center h-7 w-[30%] rounded-full bg-slate-300'>
                                        <p className='text-[12px]'>VietJet Air</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center h-7 rounded-full bg-slate-300 w-1/2 mt-2'>
                                    <p className='text-[12px]'>VietNam Airlines</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className='col-span-3'>
                        <div className='rounded-[20px] w-full h-[500px] shadow-md'>
                            <div className='w-full h-[120px] rounded-t-[20px] line-gr bg-gradient-to-r from-[#22c1c3] to-[#fdbb2d] flex items-center justify-center'>
                                <div className='w-[120px] h-[60px] rounded-[20px] bg-white flex flex-col items-center justify-center'>
                                    <p className='text-[13px] text-[#807f7f]'>Giảm</p>
                                    <b className='text-[18px]'>5%</b>
                                </div>
                            </div>
                            <div className='px-5 mt-4'>
                                <h2 className='text-[15px] font-semibold'>Happy Weekend</h2>
                                <p className='text-[15px] text-[#807f7f] mt-1 font-semibold'>
                                    Ưu đãi đặc biệt cho các chuyến bay cuối tuần
                                </p>
                                <div className='rounded-[20px] w-full h-[60px] flex items-center justify-center bg-slate-100 mt-5 gap-1'>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#9b9595]'>Bắt đầu</p>
                                        <b className='text-[14px] font-semibold'>01/01/2025</b>
                                    </div>
                                    <div className='rotate-90 w-[40px] h-[1px] bg-[#cdcdcd]'></div>
                                    <div className='flex flex-col items-center w-1/2'>
                                        <p className='text-[13px] text-[#8d8787]'>Kết thúc</p>
                                        <b className='text-[14px] font-semibold'>28/02/2025</b>
                                    </div>
                                </div>
                                <div className='rounded-[20px] w-full h-[90px] px-4 pt-2 bg-slate-100 mt-4'>
                                    <p className='text-[12px] text-[#9b9595]'>Mã khuyến mãi</p>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-[180px] h-[40px] border border-[#e9e5e5] rounded-[10px] bg-white mt-1 p-2'>
                                            <p className='text-[15px] text-black font-semibold'>WEEKEND</p>
                                        </div>
                                        <div className='w-[35px] h-[30px] bg-slate-500 rounded-md text-center text-white flex items-center justify-center cursor-pointer group hover:bg-slate-400 transtion duration-200 ease-in-out'>
                                            <FontAwesomeIcon
                                                icon={faCopy}
                                                className='group-hover:opacity-85 transtion duration-200 ease-in-out'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 w-full mt-4 flex-wrap'>
                                    <div className='flex items-center justify-center h-7 rounded-full bg-slate-300 w-1/2 mt-2'>
                                        <p className='text-[12px]'>VietNam Airlines</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
