import { faCheck, faInfo, faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '~/components/Button'

export default function Lookup() {
    return (
        <div>
            <div className='max-w-[1278px] mx-auto'>
                <h1 className='text-[24px] text-black text-center mt-4'>Tra cứu thông tin</h1>
                <div className='mt-5'>
                    <form action='' className='w-full'>
                        {/*  */}
                        <div className='flex items-center justify-center'>
                            <input
                                type='text'
                                className='text-sm w-[500px] h-[40px] rounded-s-md outline-none border border-[#cdcdcd] text-black p-3 focus:border-blue-200 transtion duration-200 ease-in-out'
                                placeholder='Tìm kiếm'
                            />
                            <Button className='w-[100px] h-[40px] p-3 flex items-center justify-center text-white text-base rounded-e-md bg-[#007bff] hover:bg-[#3d97f7] transtion duration-200 ease-in'>
                                Tìm kiếm
                            </Button>
                        </div>
                    </form>
                    {/*  */}
                    <div className='w-full rounded-md shadow border-[2px] border-[#cdcdcd] mt-5 pb-4'>
                        <div className='w-full rounded-t-md bg-[#007bff] py-3 px-4 flex items-center justify-between'>
                            <h2 className='text-[17px] font-medium text-white'>Thông tin đặt chỗ #69</h2>
                            <Button className='w-[120px] h-[30px] p-2 text-[13px] font-semibold text-center text-black flex justify-center items-center rounded-md bg-slate-300 hover:bg-slate-100 transtion duration-200 ease-in'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke-width='1.5'
                                    stroke='currentColor'
                                    className='size-4 mt-[2px]'
                                >
                                    <path
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        d='M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z'
                                    />
                                </svg>
                                In vé điện tử
                            </Button>
                        </div>
                        <div className='w-full flex py-3 px-4'>
                            <div className='flex flex-col gap-3 w-1/2'>
                                <p className=''>
                                    <b className=''>Ngày đặt:</b> 17/01/2025
                                </p>
                                <p className=''>
                                    <b className=''>Trạng thái:</b> Đã thanh toán
                                </p>
                            </div>
                            <div className='flex flex-col gap-3 w-1/2'>
                                <p className=''>
                                    <b className=''>Người liên hệ:</b> NGUYEN PHUONG THAO
                                </p>
                                <p className=''>
                                    <b className=''>SDT:</b> 0386904593
                                </p>
                                <p className=''>
                                    <b className=''>Email:</b> milothecat1136@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-md shadow px-4 py-6 mt-5'>
                        <div className='w-full flex items-center'>
                            <div className='text-[19px] font-bold w-[35%]'>
                                <h3>VietJet Air</h3>
                                <p className='text-sm font-normal'>VN102</p>
                            </div>
                            <div className='w-[65%] flex gap-28 font-bold'>
                                <div className='text-2xl text-[#007bff] flex flex-col justify-center items-center gap-2'>
                                    <p>10:30</p>
                                    <div className='text-base text-black flex flex-col justify-center items-center '>
                                        <p className=''>Hà Nội</p>
                                        <p className='text-sm font-normal'>19/01/2025</p>
                                    </div>
                                </div>
                                <div className='mt-4 flex flex-col items-center gap-2'>
                                    <div className='flex'>
                                        <hr className='bg-[#cdcdcd] w-36 h-[2px]' />
                                        <FontAwesomeIcon icon={faPlaneUp} className='mt-[-9px]' />
                                        <hr className='bg-[#cdcdcd] w-36 h-[2px]' />
                                    </div>
                                    <div className='font-medium text-sm'>
                                        <p>2h 10m</p>
                                    </div>
                                </div>
                                <div className='text-2xl text-[#007bff] flex flex-col justify-center items-center gap-2'>
                                    <p>12:40</p>
                                    <div className='text-base text-black flex flex-col justify-center items-center '>
                                        <p className=''>TP. Hồ Chí Minh</p>
                                        <p className='text-sm font-normal'>19/01/2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='w-full bg-[#cdcdcd] h-[2px] mt-4' />
                        <div className='mt-4 rounded-[4px] border border-[#007bff] w-[228px] h-[36px] py-3 px-2 flex items-center text-[#007bff] gap-[6px] font-medium'>
                            <div className='flex items-center justify-center w-4 h-4 rounded-full border border-[#007bff] text-center '>
                                <FontAwesomeIcon icon={faInfo} className='text-[10px] ' />
                            </div>
                            <p>Gói dịch vụ: Business Plus</p>
                        </div>
                        <div className='w-full mt-4 bg-slate-100 border border-[#cdcdcd] rounded-md pt-3 pb-5 px-4'>
                            <p className='text-slate-500 font-medium'>Gói dịch vụ cao cấp cho hạng thương gia</p>
                            <div className='w-full mt-5 flex'>
                                <div className='w-1/2 flex flex-col gap-5'>
                                    <div className='flex gap-2'>
                                        <FontAwesomeIcon icon={faCheck} className='text-sm text-[#178a1d]' />
                                        <div className='flex flex-col mt-[-8px] text-lg font-semibold'>
                                            <p>Hành lý xách tay</p>
                                            <p className='text-base font-normal'>
                                                Khối lượng hành lý xách tay dựa trên số kg
                                            </p>
                                            <p className='text-[15px] font-medium text-slate-500'>
                                                Hạng Business | 12kg
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <FontAwesomeIcon icon={faCheck} className='text-sm text-[#178a1d]' />
                                        <div className='flex flex-col mt-[-8px] text-lg font-semibold'>
                                            <p>Hoàn vé</p>
                                            <p className='text-base font-normal'>
                                                Số tiền hoàn lại sẽ được tính theo phần trăm vé đã mua
                                            </p>
                                            <p className='text-[15px] font-medium text-slate-500'>
                                                Hạng Business | 80%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col gap-5'>
                                    <div className='flex gap-2'>
                                        <FontAwesomeIcon icon={faCheck} className='text-sm text-[#178a1d]' />
                                        <div className='flex flex-col mt-[-8px] text-lg font-semibold'>
                                            <p>Hành lý ký gửi</p>
                                            <p className='text-base font-normal'>
                                                Khối lượng hành lý ký gửi sẽ dựa trên số kg
                                            </p>
                                            <p className='text-[15px] font-medium text-slate-500'>
                                                Hạng Business | 30kg
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <FontAwesomeIcon icon={faCheck} className='text-sm text-[#178a1d]' />
                                        <div className='flex flex-col mt-[-8px] text-lg font-semibold'>
                                            <p>Bảo hiểm du lịch</p>
                                            <p className='text-base font-normal'>
                                                Hành khách có thể lựa chọn mua hoặc không mua bảo hiểm du lịch
                                            </p>
                                            <p className='text-[15px] font-medium text-slate-500'>Hạng Business | Có</p>
                                        </div>
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
