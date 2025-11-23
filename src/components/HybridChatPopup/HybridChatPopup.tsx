// src/components/HybridChatPopup.tsx

import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
// Import các object API mới

import * as T from '~/types/aiTypes'
import Message from '~/components/Message/Message'
import { recommendationsApi } from '~/apis/recommendations.api'
import { aiChatApi } from '~/apis/aiChat.api'
import { errorHandlingApi } from '~/apis/errorHandling.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faRobot, faXmark } from '@fortawesome/free-solid-svg-icons'
import { parseFlightSearchQuery } from '~/utils/flightSearchParser'
import { airports } from '~/constants/airports'

const MAX_MESSAGE_LENGTH = 500
const CHAT_MODE: 'basic' | 'multi' = 'multi'

interface HybridChatPopupProps {
    context: T.UserContext
    contextFamily: T.UserContext
    contextBusiness: T.UserContext
}

const HybridChatPopup: React.FC<HybridChatPopupProps> = ({ context, contextFamily, contextBusiness }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [userInput, setUserInput] = useState<string>('')
    const [messages, setMessages] = useState<T.ChatMessage[]>([
        {
            sender: 'bot',
            text: `Chào bạn! Tôi là trợ lý AI. Tôi có thể giúp gì được cho bạn`
        }
    ])
    const chatMessagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
        }
    }, [messages])

    // (CẬP NHẬT) Sửa hàm addMessage để nhận 'type'
    const addMessage = (
        text: string | any,
        sender: 'user' | 'bot',
        type: T.ChatMessage['type'] = 'text' // Mặc định là 'text'
    ) => {
        setMessages((prev) => [...prev, { sender, text, type }])
    }
    // --- QUERIES (GET APIs) ---

    // (CẬP NHẬT) Sửa useEffect của useQuery 'insights'
    const {
        isLoading: insightsLoading,
        data: insightsData,
        isSuccess: insightsSuccess,
        error: insightsError,
        isError: insightsIsError,
        refetch: fetchInsights
    } = useQuery({
        queryKey: ['insights'],
        queryFn: () => recommendationsApi.getInsights(),
        enabled: false
    })
    // (CẬP NHẬT) useEffect
    useEffect(() => {
        if (insightsSuccess && insightsData) {
            // Gửi data và đánh dấu type là 'insights_response'
            addMessage(insightsData.data.data, 'bot', 'insights_response')
        }
        if (insightsIsError && insightsError) {
            addMessage(`Lỗi lấy sở thích: ${insightsError.message}`, 'bot')
        }
    }, [insightsSuccess, insightsData, insightsIsError, insightsError]) // Sửa lỗi V5

    const {
        isLoading: searchHistoryLoading,
        refetch: fetchSearchHistory,
        data: searchHistoryData,
        isSuccess: searchHistoryIsSuccess,
        isError: searchHistoryIsError,
        error: searchHistoryError
    } = useQuery({
        queryKey: ['searchHistory'],
        queryFn: () => recommendationsApi.getSearchHistory({ page: 1, limit: 10 }),
        enabled: false
    })

    // (MỚI) useEffect thay thế
    useEffect(() => {
        if (searchHistoryIsSuccess && searchHistoryData) {
            addMessage(searchHistoryData.data.data, 'bot')
        }
        if (searchHistoryIsError && searchHistoryError) {
            addMessage(`Lỗi lấy lịch sử: ${searchHistoryError.message}`, 'bot')
        }
    }, [searchHistoryIsSuccess, searchHistoryData, searchHistoryIsError, searchHistoryError])

    // (ĐÃ SỬA: Bỏ onSuccess/onError, dùng useEffect bên dưới)
    const {
        isLoading: recsHistoryLoading,
        refetch: fetchRecsHistory,
        data: recsHistoryData,
        isSuccess: recsHistoryIsSuccess,
        isError: recsHistoryIsError,
        error: recsHistoryError
    } = useQuery({
        queryKey: ['recommendationsHistory'],
        queryFn: () => recommendationsApi.getRecommendationsHistory({ page: 1, limit: 10 }),
        enabled: false
    })

    // (MỚI) useEffect thay thế
    useEffect(() => {
        if (recsHistoryIsSuccess && recsHistoryData) {
            addMessage(recsHistoryData.data.data, 'bot', 'recommen_history')
        }
        if (recsHistoryIsError && recsHistoryError) {
            addMessage(`Lỗi lấy lịch sử gợi ý: ${recsHistoryError.message}`, 'bot')
        }
    }, [recsHistoryIsSuccess, recsHistoryData, recsHistoryIsError, recsHistoryError])

    const [suggestionParams, setSuggestionParams] = useState<{ query: string; limit: number } | null>(null)
    // (ĐÃ SỬA: Bỏ onSuccess/onError, dùng useEffect bên dưới)
    const {
        isLoading: suggestionsLoading,
        data: suggestionsData,
        isSuccess: suggestionsIsSuccess,
        isError: suggestionsIsError,
        error: suggestionsError
    } = useQuery<T.ApiResponse<T.SuggestionsData>, T.ApiError>({
        queryKey: ['searchSuggestions', suggestionParams],
        queryFn: async () => (await recommendationsApi.getSearchSuggestions(suggestionParams!)).data,
        enabled: !!suggestionParams
    })

    // (MỚI) useEffect thay thế
    useEffect(() => {
        if (suggestionsIsSuccess && suggestionsData) {
            addMessage(suggestionsData.data, 'bot', 'suggestions_response')
            setSuggestionParams(null)
        }
        if (suggestionsIsError && suggestionsError) {
            addMessage(`Lỗi lấy gợi ý: ${suggestionsError.message}`, 'bot')
            setSuggestionParams(null)
        }
    }, [suggestionsIsSuccess, suggestionsData, suggestionsIsError, suggestionsError])

    const [recParams, setRecParams] = useState<{
        departure_airport_code: string
        arrival_airport_code: string
        departure_date: string
        limit: number
    } | null>(null)

    // (ĐÃ SỬA: Bỏ onSuccess/onError, dùng useEffect bên dưới)
    const {
        isLoading: recsLoading,
        data: recsData,
        isSuccess: recsIsSuccess,
        isError: recsIsError,
        error: recsError
    } = useQuery<T.ApiResponse<T.RecommendationsData>, T.ApiError>({
        queryKey: ['recommendations', recParams],
        queryFn: async () => (await recommendationsApi.getRecommendations(recParams!)).data,
        enabled: !!recParams
    })

    // (MỚI) useEffect thay thế
    useEffect(() => {
        if (recsIsSuccess && recsData) {
            addMessage(recsData.data, 'bot', 'recommendations_response')
            setRecParams(null)
        }
        if (recsIsError && recsError) {
            addMessage(`Lỗi lấy gợi ý chuyến bay: ${recsError.message}`, 'bot')
            setRecParams(null)
        }
    }, [recsIsSuccess, recsData, recsIsError, recsError])

    // (ĐÃ SỬA: Bỏ onSuccess/onError, dùng useEffect bên dưới)
    const {
        isLoading: testConnectionLoading,
        refetch: fetchTestConnection,
        data: testConnectionData,
        isSuccess: testConnectionIsSuccess,
        isError: testConnectionIsError,
        error: testConnectionError
    } = useQuery<T.TestConnectionResponse, T.ApiError>({
        queryKey: ['testConnection'],
        queryFn: async () => (await aiChatApi.testAiConnection()).data,
        enabled: false
    })

    // (MỚI) useEffect thay thế
    useEffect(() => {
        if (testConnectionIsSuccess && testConnectionData) {
            addMessage(testConnectionData.message || 'Kết nối thành công!', 'bot')
        }
        if (testConnectionIsError && testConnectionError) {
            addMessage(`Lỗi kết nối: ${testConnectionError.message}`, 'bot')
        }
    }, [testConnectionIsSuccess, testConnectionData, testConnectionIsError, testConnectionError])

    // --- MUTATIONS (POST APIs) ---
    // (ĐÃ SỬA: Sửa tất cả mutationFn)
    const trackSearchMutation = useMutation<T.TrackSearchResponse, T.ApiError, T.TrackSearchBody>({
        mutationFn: async (body) => (await recommendationsApi.trackSearch(body)).data,
        onSuccess: (data) => addMessage(data, 'bot', 'track_search_response'),
        onError: (e) => addMessage(`Lỗi track: ${e.message}`, 'bot')
    })

    // (CẬP NHẬT) Sửa bookingAssistantMutation
    const bookingAssistantMutation = useMutation({
        mutationFn: (body: T.BookingAssistantBody) => recommendationsApi.getBookingAssistant(body),
        onSuccess: (data) => {
            addMessage(data.data.data, 'bot', 'assistant_response')
        },
        onError: (e) => addMessage(`Lỗi trợ lý: ${e.message}`, 'bot')
    })

    const basicChatMutation = useMutation({
        mutationFn: (body: T.ChatBody) => aiChatApi.postBasicChat(body),
        onSuccess: (data) => addMessage(data.data.data.ai_response, 'bot', 'travel_advice_response'),
        onError: (e) => addMessage(`Lỗi AI Chat: ${e.message}`, 'bot')
    })

    const travelAdviceMutation = useMutation({
        mutationFn: async (body: { topic: string }) => (await aiChatApi.postTravelAdvice(body)).data,
        onSuccess: (data) => addMessage(data, 'bot', 'travel_advice_response'),
        onError: (e) => addMessage(`Lỗi tư vấn: ${e.message}`, 'bot')
    })

    const familyTravelMutation = useMutation({
        mutationFn: async (body: T.ChatBody) => (await aiChatApi.postFamilyTravel(body)).data,
        onSuccess: (data) => addMessage(data.data.ai_response, 'bot', 'travel_advice_response'),
        onError: (e) => addMessage(`Lỗi chat gia đình: ${e.message}`, 'bot')
    })

    const businessTravelMutation = useMutation({
        mutationFn: async (body: T.ChatBody) => (await aiChatApi.postBusinessTravelPlanning(body)).data,
        onSuccess: (data) => addMessage(data.data.ai_response, 'bot'),
        onError: (e) => addMessage(`Lỗi chat công tác: ${e.message}`, 'bot', 'travel_advice_response')
    })

    const multiTurnMutation = useMutation<T.ChatResponse, T.ApiError, T.MultiTurnChatBody>({
        mutationFn: async (body) => (await aiChatApi.postMultiTurnConversation(body)).data,
        onSuccess: (data) => addMessage(data.reply || data.message, 'bot'),
        onError: (e) => addMessage(`Lỗi chat (multi): ${e.message}`, 'bot')
    })

    // Error Handling Mutations
    const invalidEmptyMutation = useMutation<any, T.ApiError>({
        mutationFn: async () => (await errorHandlingApi.postInvalidMessageEmpty()).data,
        onError: (e) => addMessage(`Kiểm tra thành công! API trả về lỗi: ${e.message}`, 'bot')
    })
    const invalidTooLongMutation = useMutation<any, T.ApiError, T.TooLongBody>({
        mutationFn: async (body) => (await errorHandlingApi.postInvalidMessageTooLong(body)).data,
        onError: (e) => addMessage(`Kiểm tra thành công! API trả về lỗi: ${e.message}`, 'bot')
    })
    const unauthorizedMutation = useMutation<any, T.ApiError>({
        mutationFn: async () => (await errorHandlingApi.postUnauthorizedRequest()).data,
        onError: (e) => addMessage(`Kiểm tra thành công! API trả về lỗi: ${e.message}`, 'bot')
    })

    const isBotLoading =
        insightsLoading ||
        searchHistoryLoading ||
        recsHistoryLoading ||
        suggestionsLoading ||
        recsLoading ||
        testConnectionLoading ||
        trackSearchMutation.isPending ||
        bookingAssistantMutation.isPending ||
        basicChatMutation.isPending ||
        travelAdviceMutation.isPending ||
        familyTravelMutation.isPending ||
        businessTravelMutation.isPending ||
        multiTurnMutation.isPending ||
        invalidEmptyMutation.isPending ||
        invalidTooLongMutation.isPending ||
        unauthorizedMutation.isPending

    // --- LOGIC GỬI TIN NHẮN CHÍNH ---
    // (Không có thay đổi trong logic này)
    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userText = userInput.trim()
        const userTextLower = userText.toLowerCase()

        // 1. Validation Lỗi
        if (userText === '') {
            invalidEmptyMutation.mutate()
            return
        }
        if (userText.length > MAX_MESSAGE_LENGTH) {
            addMessage(userInput, 'user')
            invalidTooLongMutation.mutate({ message: userText, length: userText.length })
            setUserInput('')
            return
        }

        // 2. Thêm tin nhắn người dùng
        // (CẬP NHẬT) Thêm type 'text' cho tin nhắn của người dùng
        addMessage(userInput, 'user', 'text')
        setUserInput('')

        // --- BỘ NÃO HYBRID (RULE-BASED + AI FALLBACK) ---
        const args = userText.split(' ')
        const command = args[0].toLowerCase()

        try {
            // 2.5. Kiểm tra tìm kiếm chuyến bay bằng ngôn ngữ tự nhiên (MỚI)
            const parsedSearch = parseFlightSearchQuery(userText, airports)
            if (parsedSearch.isValid && parsedSearch.confidence >= 0.6) {
                // Nếu có đủ thông tin, gọi API recommendations
                if (parsedSearch.departure_airport_code && 
                    parsedSearch.arrival_airport_code && 
                    parsedSearch.departure_date) {
                    setRecParams({
                        departure_airport_code: parsedSearch.departure_airport_code,
                        arrival_airport_code: parsedSearch.arrival_airport_code,
                        departure_date: parsedSearch.departure_date,
                        limit: 5
                    })
                    addMessage(
                        `Đang tìm kiếm chuyến bay từ ${parsedSearch.departure_airport_code} đến ${parsedSearch.arrival_airport_code} ngày ${parsedSearch.departure_date}...`,
                        'bot'
                    )
                    return
                } else if (parsedSearch.departure_airport_code && parsedSearch.arrival_airport_code) {
                    // Nếu thiếu ngày, hỏi người dùng
                    addMessage(
                        `Tôi đã hiểu bạn muốn tìm chuyến bay từ ${parsedSearch.departure_airport_code} đến ${parsedSearch.arrival_airport_code}. Bạn muốn đi ngày nào?`,
                        'bot'
                    )
                    return
                }
            }

            // 3. Lệnh Test
            if (userTextLower === 'test 401' || userTextLower === 'unauthorized') {
                unauthorizedMutation.mutate()
            } else if (userTextLower === 'test connection') {
                fetchTestConnection()

                // 4. Lệnh GET
            } else if (command === 'insights' || userTextLower === 'sở thích') {
                fetchInsights()
            } else if (command === 'history' || userTextLower === 'lịch sử tìm kiếm') {
                fetchSearchHistory()
            } else if (command === 'rechistory' || userTextLower === 'lịch sử gợi ý') {
                fetchRecsHistory()
            } else if (command === 'suggest' && args[1]) {
                // "suggest han"
                setSuggestionParams({ query: args[1], limit: 3 })
            } else if (command === 'recommend' && args.length >= 4) {
                // "recommend SGN HAN 2025-12-01"
                setRecParams({
                    departure_airport_code: args[1].toUpperCase(),
                    arrival_airport_code: args[2].toUpperCase(),
                    departure_date: args[3],
                    limit: 3
                })

                // 5. Lệnh POST Chức năng
            } else if (command === 'track' && args.length >= 6) {
                // "track SGN HAN 2025-12-01 1 ECONOMY"
                trackSearchMutation.mutate({
                    departure_airport_code: args[1].toUpperCase(),
                    arrival_airport_code: args[2].toUpperCase(),
                    departure_date: args[3],
                    passengers: parseInt(args[4]),
                    class_code: args[5].toUpperCase()
                })
            } else if (command === 'assistant' && args.length >= 4) {
                // "assistant 123 2 ECONOMY"
                bookingAssistantMutation.mutate({
                    flight_id: parseInt(args[1]),
                    passengers: parseInt(args[2]),
                    class_code: args[3].toUpperCase()
                })

                // 6. Lệnh AI Chuyên biệt
            } else if (userTextLower.includes('tư vấn du lịch') || userTextLower.includes('mẹo hay du lịch')) {
                travelAdviceMutation.mutate({ topic: userText })
            } else if (userTextLower.includes('gia đình') || userTextLower.includes('trẻ em')) {
                // Chúng tôi là một gia đình 4 người với hai con (8 và 12 tuổi) đang lên kế hoạch cho một chuyến đi đến Tokyo. Những điểm tham quan và hoạt động nào phù hợp nhất với gia đình?
                familyTravelMutation.mutate({ message: userText, context: contextFamily })
            } else if (userTextLower.includes('công tác') || userTextLower.includes('business')) {
                // Tôi cần lên kế hoạch cho một chuyến công tác đến Singapore trong 3 ngày. Tôi sẽ có các cuộc họp ở khu vực trung tâm thương mại (CBD) và cần tư vấn về khách sạn, nhà hàng cho bữa tối với khách hàng và phương tiện di chuyển hiệu quả.
                businessTravelMutation.mutate({ message: userText, context: contextBusiness })
                // 7. FALLBACK: Dùng BASIC CHAT hoặc MULTI-TURN
            } else {
                if (CHAT_MODE === 'multi') {
                    basicChatMutation.mutate({
                        message: userText,
                        context: context
                    })
                }
            }
        } catch (error) {
            addMessage(`Đã xảy ra lỗi khi gửi: ${(error as Error).message}`, 'bot')
        }
    }

    // --- RENDER (JSX) ---
    // (Không có thay đổi trong JSX)
    return (
        <>
            {/* Nút Chat Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='fixed bottom-8 right-8 bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all'
                aria-label='Mở cửa sổ chat'
            >
                {isOpen ? (
                    <FontAwesomeIcon icon={faXmark} className='w-8 h-8' />
                ) : (
                    <FontAwesomeIcon icon={faRobot} className='w-8 h-8' />
                )}
            </button>

            {/* Cửa sổ Chat */}
            <div
                className={`fixed bottom-5 z-90 right-8 w-full max-w-md h-[600px] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
            >
                {/* Header */}
                <div className='bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg'>
                    <h3 className='font-semibold text-lg'>Trợ lý Hybrid AI</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className='text-white text-xl hover:bg-blue-700 p-1 rounded-full'
                        aria-label='Đóng cửa sổ chat'
                    >
                        <FontAwesomeIcon icon={faXmark} className='w-6 h-6' />
                    </button>
                </div>

                {/* Khung tin nhắn */}
                <div ref={chatMessagesRef} className='flex-grow p-4 overflow-y-auto bg-gray-100'>
                    {messages.map((msg, index) => (
                        <Message key={index} message={msg} />
                    ))}
                    {isBotLoading && <Message message={{ sender: 'bot', text: '...' }} />}
                </div>

                {/* Khung nhập liệu */}
                <form
                    onSubmit={handleSendMessage}
                    className='p-4 border-t border-gray-200 flex items-center bg-white rounded-b-lg'
                >
                    <input
                        type='text'
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Gõ 'insights', 'history', 'track ...', hoặc chat..."
                        className='text-black flex-grow border border-gray-300 rounded-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 mr-3'
                        disabled={isBotLoading}
                    />
                    <button
                        type='submit'
                        className='bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-blue-700 transition-colors flex-shrink-0'
                        disabled={isBotLoading}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} className='w-5 h-5' />
                    </button>
                </form>
            </div>
        </>
    )
}

export default HybridChatPopup
