import { FC } from 'react'

type Bank = {
    id: string
    name: string
    logoUrl: string
}

type BankSelectionGridProps = {
    banks: Bank[]
    selectedBank: string | null
    onSelectBank: (id: string) => void
}

const BankSelectionGrid: FC<BankSelectionGridProps> = ({ banks, selectedBank, onSelectBank }) => {
    return (
        <div>
            <h3 className='text-md font-semibold text-gray-700 mb-4'>Vui lòng chọn ngân hàng của bạn</h3>
            <div className='grid grid-cols-3 sm:grid-cols-4 gap-4'>
                {banks.map((bank) => (
                    <div
                        key={bank.id}
                        onClick={() => onSelectBank(bank.id)}
                        className={`p-2 border rounded-lg cursor-pointer flex items-center justify-center transition-all duration-200 hover:shadow-md hover:border-blue-400 ${selectedBank === bank.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 bg-white'}`}
                    >
                        <img src={bank.logoUrl} alt={bank.name} className='h-10 object-contain' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BankSelectionGrid
