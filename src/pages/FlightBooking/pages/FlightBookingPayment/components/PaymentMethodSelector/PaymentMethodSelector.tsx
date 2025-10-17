import { FC, JSX } from 'react'
import { Landmark, Globe } from 'lucide-react'
import BankSelectionGrid from '../BankSelectionGrid/BankSelectionGrid'

export type PaymentOptionId = 'bank_transfer' | 'domestic_card' | 'international_card'

type Bank = {
    id: string
    name: string
    logoUrl: string
}

type PaymentOption = {
    id: PaymentOptionId
    name: string
    icon: JSX.Element
}

const paymentOptions: PaymentOption[] = [
    {
        id: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        icon: (
            <span className='text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full'>
                Ưu đãi giảm giá
            </span>
        )
    },
    {
        id: 'domestic_card',
        name: 'Thẻ ATM nội địa / Internet Banking',
        icon: <Landmark className='w-6 h-6 text-gray-500' />
    },
    {
        id: 'international_card',
        name: 'Thẻ quốc tế (Visa, Mastercard, JCB)',
        icon: <Globe className='w-6 h-6 text-gray-500' />
    }
]

type PaymentMethodSelectorProps = {
    selectedPayment: PaymentOptionId
    onSelectPayment: (id: PaymentOptionId) => void
    banks: Bank[]
    selectedBank: string | null
    onSelectBank: (id: string) => void
}

const InternationalCardInfo: FC = () => (
    <div className='p-4 border-t border-gray-200'>
        <p className='text-sm text-gray-600 text-center'>
            Bạn sẽ được chuyển đến cổng thanh toán của đối tác an toàn để nhập thông tin thẻ.
        </p>
    </div>
)

const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({
    selectedPayment,
    onSelectPayment,
    banks,
    selectedBank,
    onSelectBank
}) => {
    return (
        <div className='mb-8'>
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Bạn muốn thanh toán thế nào?</h2>
            <div className='space-y-4'>
                {paymentOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`border rounded-lg transition-all duration-300 ${selectedPayment === option.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 bg-white'}`}
                    >
                        <div onClick={() => onSelectPayment(option.id)} className='p-4 cursor-pointer'>
                            <div className='flex items-center'>
                                <div className='flex-shrink-0 w-6 h-6 border-2 rounded-full flex items-center justify-center mr-4'>
                                    {selectedPayment === option.id && (
                                        <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>
                                    )}
                                </div>
                                <div className='flex-grow'>
                                    <span className='font-semibold text-gray-700'>{option.name}</span>
                                </div>
                                {option.icon}
                            </div>
                        </div>

                        {selectedPayment === option.id && (
                            <>
                                {option.id === 'domestic_card' && (
                                    <div className='p-4 border-t border-gray-200'>
                                        <BankSelectionGrid
                                            banks={banks}
                                            selectedBank={selectedBank}
                                            onSelectBank={onSelectBank}
                                        />
                                    </div>
                                )}
                                {option.id === 'international_card' && <InternationalCardInfo />}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PaymentMethodSelector
