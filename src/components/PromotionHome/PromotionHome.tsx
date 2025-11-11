import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
    faCopy,
    faTicket,
    faExclamationTriangle,
    faChevronRight,
    faChevronLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { promotionApi } from '~/apis/promotion.api'
import { formatCurrencyVND } from '~/utils/utils'
import { path } from '~/constants/path'
import { Promotion } from '~/types/promotion'

// Component Skeleton (để hiển thị khi loading)
const PromotionSkeleton: React.FC = () => (
    <div className='flex-shrink-0 w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]'>
        <div className='rounded-lg w-full h-[180px] shadow-md bg-white border border-gray-200 animate-pulse'>
            <div className='h-[60px] rounded-t-lg bg-gray-200'></div>
            <div className='p-2 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-3 bg-gray-200 rounded w-3/4'></div>
                <div className='h-8 bg-gray-100 rounded-lg mt-2'></div>
            </div>
        </div>
    </div>
)

export default function PromotionHome() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const {
        data: dataPromotion,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['promotions'],
        queryFn: () => promotionApi.getPromotion().then((res) => res.data),
        staleTime: 1000 * 60 * 5
    })

    const promotions = dataPromotion?.data || []

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const handleCopy = useCallback((code: string) => {
        navigator.clipboard.writeText(code).then(
            () => {
                toast.success(`Đã sao chép mã: ${code}`)
                setCopiedCode(code)
                setTimeout(() => setCopiedCode(null), 2000)
            },
            (err) => {
                toast.error('Sao chép thất bại')
            }
        )
    }, [])

    const checkScrollButtons = useCallback(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const { scrollLeft, scrollWidth, clientWidth } = container
        setCanScrollLeft(scrollLeft > 2)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
    }, [])

    const handleScroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = container.clientWidth * 0.8
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }, [])

    useEffect(() => {
        if (!isLoading) {
            checkScrollButtons()
        }

        window.addEventListener('resize', checkScrollButtons)

        return () => {
            window.removeEventListener('resize', checkScrollButtons)
        }
    }, [isLoading, promotions, checkScrollButtons])

    if (!isLoading && (isError || promotions.length === 0)) {
        return null
    }

    return (
        <div className='mt-8'>
            <div className='max-w-[1278px] mx-auto relative'>
                <div className='flex justify-between items-center mb-5'>
                    {/* SỬA: Thêm ảnh và bọc trong div flex */}
                    <div className='flex items-center gap-3'>
                        <img
                            src='https://ik.imagekit.io/tvlk/image/imageResource/2024/09/04/1725447475210-6886260457851a5434e89e2220fa78e7.png?_src=imagekit&tr=q-40,h-24'
                            alt='Ưu đãi'
                            className='h-6 w-6' // Dùng h-6 (24px) như trong URL
                            loading='lazy'
                        />
                        <h2 className='text-2xl font-bold text-[#073e68]'>Ưu đãi hấp dẫn</h2>
                    </div>

                    <Link
                        to={path.promotion}
                        className='text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    >
                        Xem tất cả
                        <FontAwesomeIcon icon={faChevronRight} className='w-3 h-3' />
                    </Link>
                </div>

                <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollButtons}
                    className='flex overflow-x-auto gap-5 pb-8
                     scrollbar-none [&::-webkit-scrollbar]:hidden'
                >
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, index) => <PromotionSkeleton key={index} />)
                        : promotions.map((promotion: Promotion) => (
                              <div
                                  className='flex-shrink-0 w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]'
                                  key={promotion.promotion_id}
                              >
                                  <div className='rounded-lg w-full shadow-lg border border-gray-200 bg-white flex flex-col overflow-hidden h-[180px]'>
                                      {/* Header Card */}
                                      <div className='w-full p-2 bg-blue-600 text-white flex items-center gap-2'>
                                          <FontAwesomeIcon icon={faTicket} className='text-2xl opacity-80' />
                                          <div>
                                              <p className='text-[11px] font-medium opacity-90'>Giảm</p>
                                              <b className='text-xl font-bold'>
                                                  {promotion.discount_amount > 0
                                                      ? formatCurrencyVND(promotion.discount_amount * 1000)
                                                      : `${promotion.discount_percentage}%`}
                                              </b>
                                          </div>
                                      </div>

                                      {/* Body Card */}
                                      <div className='p-2 flex flex-col flex-grow'>
                                          <p className='text-xs text-gray-500 mb-0.5'>Mã: {promotion.code}</p>
                                          <h2 className='text-sm font-semibold text-gray-900 mb-1'>
                                              {promotion.description}
                                          </h2>
                                          <p className='text-xs text-gray-500 mt-auto'>
                                              Hạn sử dụng:
                                              <span className='font-medium text-gray-600 ml-1'>
                                                  {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                                              </span>
                                          </p>
                                      </div>

                                      {/* Footer Card */}
                                      <div className='p-2 bg-gray-50 border-t border-gray-100'>
                                          <div className='flex items-center gap-1.5'>
                                              <div className='flex-grow h-8 border-2 border-dashed border-gray-300 rounded-md bg-white flex items-center justify-center'>
                                                  <p className='text-sm text-gray-800 font-bold tracking-wider'>
                                                      {promotion.code}
                                                  </p>
                                              </div>
                                              <button
                                                  onClick={() => handleCopy(promotion.code)}
                                                  className={`w-24 h-8 rounded-md font-semibold text-white text-sm transition-colors duration-200 flex items-center justify-center gap-1 ${
                                                      copiedCode === promotion.code
                                                          ? 'bg-green-500'
                                                          : 'bg-blue-500 hover:bg-blue-600'
                                                  }`}
                                              >
                                                  {copiedCode === promotion.code ? (
                                                      'Đã chép'
                                                  ) : (
                                                      <>
                                                          <FontAwesomeIcon icon={faCopy} className='w-3 h-3' />
                                                          Sao chép
                                                      </>
                                                  )}
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                </div>

                {/* Nút cuộn trái */}
                {canScrollLeft && (
                    <button
                        onClick={() => handleScroll('left')}
                        className='absolute left-0 top-1/2 -translate-y-1/2 z-10
                       w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200
                       flex items-center justify-center text-gray-700
                       hover:bg-gray-100 transition-all
                       -translate-x-1/2'
                        aria-label='Cuộn sang trái'
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className='w-4 h-4' />
                    </button>
                )}

                {/* Nút cuộn phải */}
                {canScrollRight && (
                    <button
                        onClick={() => handleScroll('right')}
                        className='absolute right-0 top-1/2 -translate-y-1/2 z-10
                       w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200
                       flex items-center justify-center text-gray-700
                       hover:bg-gray-100 transition-all
                       translate-x-1/2'
                        aria-label='Cuộn sang phải'
                    >
                        <FontAwesomeIcon icon={faChevronRight} className='w-4 h-4' />
                    </button>
                )}
            </div>
        </div>
    )
}
