import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faTwitter, faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom' // Giả sử bạn dùng React Router

export default function Footer() {
    return (
        <footer className='bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8 shadow-inner mt-6'>
            <div className='max-w-[1278px] mx-auto'>
                {/* === Hàng 1: Các Cột Link Chính & Tải App === */}
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-gray-700 pb-10'>
                    {/* Cột 1: Về Flight Booking */}
                    <div className='col-span-1'>
                        <h3 className='text-sm font-bold text-white tracking-wide uppercase mb-5'>Về Flight Booking</h3>
                        <ul className='space-y-3'>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 2: Sản Phẩm */}
                    <div className='col-span-1'>
                        <h3 className='text-sm font-bold text-white tracking-wide uppercase mb-5'>Sản Phẩm</h3>
                        <ul className='space-y-3'>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Vé máy bay
                                </Link>
                            </li>
                            <li>
                                <span className='text-sm text-gray-500'>Vé khách sạn (Sắp có)</span>
                            </li>
                            <li>
                                <span className='text-sm text-gray-500'>Combo (Sắp có)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ Trợ */}
                    <div className='col-span-1'>
                        <h3 className='text-sm font-bold text-white tracking-wide uppercase mb-5'>Hỗ Trợ</h3>
                        <ul className='space-y-3'>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Trung tâm trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Chính sách thanh toán
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to=''
                                    className='text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200'
                                >
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Theo dõi & Liên hệ */}
                    <div className='col-span-1'>
                        <h3 className='text-sm font-bold text-white tracking-wide uppercase mb-5'>
                            Kết nối với chúng tôi
                        </h3>
                        <div className='flex space-x-4 mb-6'>
                            <a
                                href='#'
                                className='text-gray-400 hover:text-white transition-colors duration-200'
                                aria-label='Facebook'
                            >
                                <FontAwesomeIcon icon={faFacebookF} className='w-6 h-6' />
                            </a>
                            <a
                                href='#'
                                className='text-gray-400 hover:text-white transition-colors duration-200'
                                aria-label='Instagram'
                            >
                                <FontAwesomeIcon icon={faInstagram} className='w-6 h-6' />
                            </a>
                            <a
                                href='#'
                                className='text-gray-400 hover:text-white transition-colors duration-200'
                                aria-label='Twitter'
                            >
                                <FontAwesomeIcon icon={faTwitter} className='w-6 h-6' />
                            </a>
                            <a
                                href='#'
                                className='text-gray-400 hover:text-white transition-colors duration-200'
                                aria-label='Email'
                            >
                                <FontAwesomeIcon icon={faEnvelope} className='w-6 h-6' />
                            </a>
                        </div>
                    </div>

                    {/* Cột 5: Tải ứng dụng */}
                    <div className='col-span-2 md:col-span-1'>
                        <h3 className='text-sm font-bold text-white tracking-wide uppercase mb-5'>Tải ứng dụng</h3>
                        <div className='space-y-4'>
                            {/* Apple App Store Badge */}
                            <a
                                href='#'
                                className='w-40 h-12 bg-gray-700 rounded-lg flex items-center justify-center group hover:bg-gray-600 transition-colors duration-200'
                            >
                                <FontAwesomeIcon icon={faApple} className='w-6 h-6 text-white mr-2' />
                                <div>
                                    <p className='text-xs text-gray-400 group-hover:text-gray-300'>Tải về trên</p>
                                    <p className='text-base font-semibold text-white'>App Store</p>
                                </div>
                            </a>
                            {/* Google Play Badge */}
                            <a
                                href='#'
                                className='w-40 h-12 bg-gray-700 rounded-lg flex items-center justify-center group hover:bg-gray-600 transition-colors duration-200'
                            >
                                <FontAwesomeIcon icon={faGooglePlay} className='w-6 h-6 text-white mr-2' />
                                <div>
                                    <p className='text-xs text-gray-400 group-hover:text-gray-300'>Có trên</p>
                                    <p className='text-base font-semibold text-white'>Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* === Hàng 2: Đối tác Thanh toán (Kiểu Traveloka) === */}
                <div className='mt-12 pt-8 border-t border-gray-700'>
                    <h3 className='text-sm font-semibold text-white tracking-wider uppercase mb-5 text-center'>
                        Đối tác thanh toán
                    </h3>

                    <div className='grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
                        {/* ZaloPay */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2bYXYW8tAuSXOnJWJBM21l-365rmRLRgyPA&s'
                                alt='ZaloPay'
                                className='h-full max-h-6 object-contain'
                            />
                        </div>
                        {/* VNPay */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png'
                                alt='VNPay'
                                className='h-full max-h-6 object-contain'
                            />
                        </div>
                        {/* Momo */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0'
                                alt='Momo'
                                className='h-full max-h-5 object-contain'
                            />
                        </div>
                        {/* Visa */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7JrWFU9hdQn_dBVSqYovt0ySMJRTWM2d0zw&s'
                                alt='Visa'
                                className='h-full max-h-4 object-contain'
                            />
                        </div>
                        {/* Mastercard */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3JB7Ht82ofqBbNUdvJCyeoBy7hC8pkklFcA&s'
                                alt='Mastercard'
                                className='h-full max-h-6 object-contain'
                            />
                        </div>
                        {/* Vietcombank */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://api.vietqr.io/img/VCB.png'
                                alt='Vietcombank'
                                className='h-full max-h-7 object-contain'
                            />
                        </div>
                        {/* Techcombank */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://api.vietqr.io/img/TCB.png'
                                alt='Techcombank'
                                className='h-full max-h-7 object-contain'
                            />
                        </div>
                        {/* MB Bank */}
                        <div className='bg-white rounded-md p-2 flex items-center justify-center h-12'>
                            <img
                                src='https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png'
                                alt='MB Bank'
                                className='h-full max-h-7 object-contain'
                            />
                        </div>
                    </div>
                </div>

                {/* === Hàng 3: Copyright === */}
                <div className='mt-10 pt-8 border-t border-gray-700 text-center'>
                    <p className='text-xs text-gray-500'>&copy; 2025 Flight Booking. Mọi quyền được bảo lưu.</p>
                    <p className='text-xs text-gray-600 mt-1'>
                        Một sản phẩm được phát triển bởi{' '}
                        <a href='#' className='hover:text-blue-400 transition-colors'>
                            Flight Booking
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
