import React, { useState, useEffect } from 'react'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Định nghĩa kiểu dữ liệu cho một món ăn và danh mục
export interface Meal {
    id: string
    name: string
    description: string
    price: number
}

export interface MealCategory {
    category: string
    items: Meal[]
}

// Dữ liệu giả lập cho các món ăn
export const MEAL_OPTIONS: MealCategory[] = [
    {
        category: 'Món ăn nhẹ',
        items: [
            {
                id: 'banhmi',
                name: 'Bánh mì kẹp thịt nguội',
                description: 'Bánh mì kẹp thịt nguội và rau sống',
                price: 85000
            },
            { id: 'sandwich', name: 'Sandwich gà', description: 'Sandwich kẹp gà và phô mai', price: 75000 }
        ]
    },
    {
        category: 'Món chính',
        items: [
            {
                id: 'bosot',
                name: 'Bò sốt tiêu đen',
                description: 'Bò Úc thượng hạng sốt tiêu đen, ăn kèm cơm trắng và rau củ',
                price: 180000
            },
            { id: 'canuong', name: 'Cá hồi nướng', description: 'Cá hồi Na Uy nướng với sốt chanh dây', price: 200000 },
            {
                id: 'comga',
                name: 'Cơm gà xối mỡ',
                description: 'Cơm gà với da giòn, ăn kèm xà lách và nước mắm',
                price: 150000
            }
        ]
    },
    {
        category: 'Tráng miệng',
        items: [
            {
                id: 'mousse',
                name: 'Bánh mousse chanh dây',
                description: 'Bánh mousse mềm mịn vị chanh dây chua ngọt',
                price: 65000
            },
            {
                id: 'chehatsen',
                name: 'Chè hạt sen long nhãn',
                description: 'Hạt sen và long nhãn thanh mát, giải nhiệt',
                price: 45000
            },
            {
                id: 'traicay',
                name: 'Trái cây theo mùa',
                description: 'Các loại trái cây tươi ngon được cắt sẵn',
                price: 55000
            }
        ]
    }
]

// Kiểu dữ liệu cho các món ăn đã chọn: { mealId: quantity }
export type SelectedMeals = { [mealId: string]: number }

export interface Passenger {
    id: number
    fullName: string
    type: 'Người lớn' | 'Trẻ em'
    baggageId: string
    selectedMeals: SelectedMeals // Thêm thuộc tính này
}

// Kiểu dữ liệu cho các lựa chọn tạm thời trong modal
type TempMealSelections = { [passengerId: number]: SelectedMeals }

interface MealModalProps {
    isOpen: boolean
    onClose: () => void
    passengers: Passenger[]
    onSave: (allSelections: TempMealSelections) => void
}

const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, passengers, onSave }) => {
    const [activePassengerId, setActivePassengerId] = useState<number>(passengers[0]?.id)
    const [tempSelections, setTempSelections] = useState<TempMealSelections>({})

    useEffect(() => {
        if (isOpen) {
            const initialSelections = passengers.reduce((acc, p) => {
                acc[p.id] = { ...p.selectedMeals }
                return acc
            }, {} as TempMealSelections)
            setTempSelections(initialSelections)
            setActivePassengerId(passengers[0]?.id)
        }
    }, [isOpen, passengers])

    const handleQuantityChange = (mealId: string, quantity: number) => {
        if (quantity < 0) return
        setTempSelections((prev) => {
            const newSelectionsForPassenger = { ...prev[activePassengerId], [mealId]: quantity }
            // Xóa món ăn khỏi danh sách nếu số lượng là 0
            if (quantity === 0) {
                delete newSelectionsForPassenger[mealId]
            }
            return { ...prev, [activePassengerId]: newSelectionsForPassenger }
        })
    }

    const handleSave = () => {
        onSave(tempSelections)
        onClose()
    }

    if (!isOpen) return null

    const currentSelections = tempSelections[activePassengerId] || {}
    const subtotal = Object.values(tempSelections).reduce((total, passengerMeals) => {
        return (
            total +
            Object.entries(passengerMeals).reduce((passengerTotal, [mealId, quantity]) => {
                const allMeals = MEAL_OPTIONS.flatMap((cat) => cat.items)
                const meal = allMeals.find((m) => m.id === mealId)
                return passengerTotal + (meal ? meal.price * quantity : 0)
            }, 0)
        )
    }, 0)

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col'>
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Chọn món ăn</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>
                        <FontAwesomeIcon icon={faClose} className='text-[28px]' />
                    </button>
                </div>

                <div className='border-b border-gray-200 px-2'>
                    <div className='flex'>
                        {passengers.map((p, index) => (
                            <button
                                key={p.id}
                                onClick={() => setActivePassengerId(p.id)}
                                className={`py-3 px-4 font-semibold text-sm ${activePassengerId === p.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Người lớn {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='overflow-y-auto flex-grow p-6'>
                    {MEAL_OPTIONS.map((category) => (
                        <div key={category.category} className='mb-6'>
                            <h3 className='font-semibold text-lg mb-4 text-gray-700'>{category.category}</h3>
                            <div className='space-y-4'>
                                {category.items.map((meal) => {
                                    const quantity = currentSelections[meal.id] || 0
                                    return (
                                        <div
                                            key={meal.id}
                                            className='flex justify-between items-center border-2 border-[#cdcdcd] rounded-md p-4 shadow'
                                        >
                                            <div>
                                                <p className='font-semibold text-gray-800'>{meal.name}</p>
                                                <p className='text-sm text-gray-500'>{meal.description}</p>
                                            </div>
                                            <div className='flex items-center space-x-4'>
                                                <p className='font-bold text-blue-600 w-24 text-right'>
                                                    {meal.price.toLocaleString('vi-VN')} ₫
                                                </p>
                                                <div className='flex items-center space-x-2'>
                                                    <button
                                                        onClick={() => handleQuantityChange(meal.id, quantity - 1)}
                                                        disabled={quantity === 0}
                                                        className='w-8 h-8 border rounded text-lg font-bold  text-gray-800 flex justify-center items-center '
                                                    >
                                                        <span className='mt-[-4px]'> -</span>
                                                    </button>
                                                    <span className='w-8 text-center font-semibold'>{quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(meal.id, quantity + 1)}
                                                        className='w-8 h-8 border rounded text-lg font-bold text-gray-800 flex justify-center items-center'
                                                    >
                                                        <span className='mt-[-4px]'> +</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200'>
                    <div>
                        <span className='text-gray-600'>Tổng phụ</span>
                        <p className='font-bold text-2xl text-blue-600'>{subtotal.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className='bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700'
                    >
                        Hoàn tất
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MealModal
