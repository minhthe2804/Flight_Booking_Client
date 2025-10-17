import { FC } from 'react'
import { QrCode, CreditCard } from 'lucide-react'

type PaymentOptionId = 'bank_transfer' | 'domestic_card' | 'international_card'
type Bank = {
    id: string
    name: string
    logoUrl: string
}

type SummaryAndSubmitProps = {
    selectedPayment: PaymentOptionId
    selectedBank: string | null
    banks: Bank[]
}

const SummaryAndSubmit: FC<SummaryAndSubmitProps> = ({ selectedPayment, selectedBank, banks }) => {
    const getButtonContent = () => {
        if (selectedPayment === 'bank_transfer') {
            return (
                <>
                    <QrCode className='w-5 h-5 mr-2' />
                    Hiển thị mã QR để thanh toán
                </>
            )
        }
        if (selectedPayment === 'domestic_card') {
            if (selectedBank) {
                const bankName = banks.find((b) => b.id === selectedBank)?.name || 'ngân hàng'
                return `Tiếp tục với ${bankName}`
            }
            return 'Vui lòng chọn ngân hàng'
        }
        if (selectedPayment === 'international_card') {
            return (
                <>
                    <CreditCard className='w-5 h-5 mr-2' />
                    Tiếp tục đến cổng thanh toán
                </>
            )
        }
    }

    const isButtonDisabled = selectedPayment === 'domestic_card' && !selectedBank

    return (
        <div className='border-t pt-6 mt-8'>
            <div className='flex justify-between items-baseline mb-4'>
                <div>
                    <p className='text-lg font-bold text-gray-800'>Tổng cộng</p>
                    <p className='text-xs text-gray-500'>Đã bao gồm thuế & phí</p>
                </div>
                <p className='text-2xl font-bold text-blue-600'>8.135.000 VND</p>
            </div>
            <button
                disabled={isButtonDisabled}
                className='w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
                {getButtonContent()}
            </button>
        </div>
    )
}

export default SummaryAndSubmit
