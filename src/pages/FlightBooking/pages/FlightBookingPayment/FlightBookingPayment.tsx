import { useState } from 'react'
import CountdownTimer from './components/CountdownTimer'
import PaymentMethodSelector, { PaymentOptionId } from './components/PaymentMethodSelector/PaymentMethodSelector'
import PromoSection from './components/PromoSection/PromoSection'
import SummaryAndSubmit from './components/SummaryAndSubmit/SummaryAndSubmit'
import FlightSummaryCard, { FlightData, PriceDetails } from './components/FlightSummaryCard/FlightSummaryCard'

// --- DỮ LIỆU ĐẦY ĐỦ: 12 NGÂN HÀNG PHỔ BIẾN ---
const banks = [
    { id: 'vcb', name: 'Vietcombank', logoUrl: 'https://api.vietqr.io/img/VCB.png' },
    { id: 'tcb', name: 'Techcombank', logoUrl: 'https://api.vietqr.io/img/TCB.png' },
    {
        id: 'mb',
        name: 'MB Bank',
        logoUrl:
            'https://static.wixstatic.com/media/9d8ed5_fc3bb8e4fd18410182baae118781f995~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9d8ed5_fc3bb8e4fd18410182baae118781f995~mv2.jpg'
    },
    { id: 'acb', name: 'ACB', logoUrl: 'https://api.vietqr.io/img/ACB.png' },
    { id: 'bidv', name: 'BIDV', logoUrl: 'https://api.vietqr.io/img/BIDV.png' },
    {
        id: 'vietinbank',
        name: 'VietinBank',
        logoUrl: 'https://free.vector6.com/wp-content/uploads/2020/04/028-Logo-NganHang-Vietinbank.jpg'
    },
    { id: 'agribank', name: 'Agribank', logoUrl: 'https://inhoangha.com/uploads/logo-agribank.jpg' },
    {
        id: 'vpbank',
        name: 'VPBank',
        logoUrl: 'https://inkythuatso.com/uploads/thumbnails/800/2021/11/vpbank-logo-inkythuatso-01-10-13-49-34.jpg'
    },
    {
        id: 'sacombank',
        name: 'Sacombank',
        logoUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo-Sacombank-new.png/1200px-Logo-Sacombank-new.png'
    },
    {
        id: 'tpbank',
        name: 'TPBank',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_TPBank.svg/1200px-Logo_TPBank.svg.png'
    },
    { id: 'vib', name: 'VIB', logoUrl: 'https://api.vietqr.io/img/VIB.png' },
    { id: 'shb', name: 'SHB', logoUrl: 'https://api.vietqr.io/img/SHB.png' }
]

// --- DỮ LIỆU ĐẦY ĐỦ: KHUYẾN MÃI ---
const promotions = [
    {
        id: 'promo1',
        title: 'Mùa du lịch',
        description: 'Giảm giá cho các chuyến bay đường dài',
        discount: 'Giảm: 200,000 VND cho VietJet Air',
        iconColor: 'text-gray-400'
    },
    {
        id: 'promo2',
        title: 'Khuyến mãi đặc biệt',
        description: 'Ưu đãi cho khách hàng đã có tài khoản',
        discount: 'Giảm: 300,000 VND cho VietJet Air',
        iconColor: 'text-blue-500'
    }
]

const VALID_PROMO_CODES = ['PROMO1', 'PROMO2']

const flightData: FlightData = {
    departure: { time: '04:40', city: 'Hà Nội', date: 'Th 6, 24/01/2025' },
    arrival: { time: '05:40', city: 'TP. Hồ Chí Minh', date: 'Th 6, 24/01/2025' },
    duration: '1h 0m',
    type: 'Bay thẳng',
    airline: 'VietJet Air',
    flightClass: 'Economy Class'
}

const passengers: string[] = [
    'Bà NGUYEN PHUONG THAO (Người lớn 1)',
    'Ông NGUYEN NGOC ANH (Người lớn 2)',
    'Bà NGUYEN MINH THU (Người lớn 3)'
]

const priceDetails: PriceDetails = {
    baseFare: '7.500.000 VND',
    baggage: '+200.000 VND',
    meals: '+435.000 VND',
    total: '8.135.000 VND'
}

export default function FlightBookingPayment() {
    const [selectedPayment, setSelectedPayment] = useState<PaymentOptionId>('bank_transfer')
    const [selectedBank, setSelectedBank] = useState<string | null>(null)
    const [appliedPromoId, setAppliedPromoId] = useState<string | null>(null)

    const handleSelectPayment = (id: PaymentOptionId) => {
        // Thêm logic để click lại sẽ đóng accordion
        if (selectedPayment === id) {
            setSelectedPayment('bank_transfer') // Hoặc null nếu bạn muốn không chọn gì
        } else {
            setSelectedPayment(id)
        }
        setSelectedBank(null)
    }

    const handleTimeUp = () => {
        console.log('Hết giờ rồi!')
        // Thêm logic chuyển trang hoặc hiển thị popup ở đây.
        alert('Đã hết giờ!')
    }

    const handleApplyPromo = (promoId: string): boolean => {
        // Trong thực tế, bạn sẽ gọi API ở đây để kiểm tra mã
        // Ở đây chúng ta chỉ giả lập bằng cách kiểm tra trong một mảng
        const validIds = promotions.map((p) => p.id).concat(VALID_PROMO_CODES)

        if (validIds.includes(promoId.toUpperCase())) {
            setAppliedPromoId(promoId.toUpperCase())
            console.log(`LOGIC: Áp dụng mã ${promoId.toUpperCase()}, tính lại tổng tiền...`)
            // Trả về true để component con biết là đã thành công
            return true
        }
        // Trả về false nếu mã không hợp lệ
        return false
    }

    const handleRemovePromo = (): void => {
        console.log(`LOGIC: Gỡ mã ${appliedPromoId}, tính lại tổng tiền...`)
        setAppliedPromoId(null)
    }
    return (
        <div className='mt-5'>
            <div className='max-w-[1278px] mx-auto'>
                <div className='grid grid-cols-12 gap-5'>
                    <div className='col-span-8'>
                        <CountdownTimer initialMinutes={10} onExpire={handleTimeUp} />
                        <PaymentMethodSelector
                            selectedPayment={selectedPayment}
                            onSelectPayment={handleSelectPayment}
                            banks={banks}
                            selectedBank={selectedBank}
                            onSelectBank={setSelectedBank}
                        />
                        <PromoSection
                            promotions={promotions}
                            appliedPromoId={appliedPromoId}
                            onApplyPromo={handleApplyPromo}
                            onRemovePromo={handleRemovePromo}
                        />
                        <SummaryAndSubmit selectedPayment={selectedPayment} selectedBank={selectedBank} banks={banks} />
                    </div>

                    <div className='col-span-4 '>
                        <FlightSummaryCard
                            flightData={flightData}
                            passengers={passengers}
                            priceDetails={priceDetails}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
