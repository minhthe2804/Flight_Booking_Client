// src/components/Message.tsx

import React from 'react'
import AssistantResponse from '../AssistantResponse/AssistantResponse'
import InsightsResponse from '../InsightsResponse/InsightsResponse'
import RecommentHistory from '../RecommentHistory/RecommenHistory'
import SuggestionsResponse from '../SuggestionsResponse/SuggestionsResponse'
import RecommendationsResponse from '../RecommendationsResponse/RecommendationsResponse'
import TrackSearchResponse from '../TrackSearchResponse/TrackSearchResponse'
import TravelAdviceResponse from '../TravelAdviceResponse/TravelAdviceResponse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons'

// Định nghĩa kiểu cho Props
interface MessageProps {
    message: any
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    console.log(message)
    const isBot = message.sender === 'bot'
    // Hàm render text, hỗ trợ hiển thị JSON
    const renderText = (text: string | any) => {
        // (CẬP NHẬT) Thêm 'else if' cho type mới
        if (message.type === 'assistant_response' && typeof message.text === 'object') {
            return <AssistantResponse data={message.text} />
        } else if (message.type === 'insights_response' && typeof message.text === 'object') {
            return <InsightsResponse data={message.text} />
        } else if (message.type === 'recommen_history' && Array.isArray(message.text)) {
            return <RecommentHistory data={message.text} />
        } else if (message.type === 'suggestions_response' && typeof message.text === 'object') {
            return <SuggestionsResponse data={message.text} />
        } else if (message.type === 'recommendations_response' && typeof message.text === 'object') {
            return <RecommendationsResponse data={message.text} />
        } else if (message.type === 'track_search_response' && typeof message.text === 'object') {
            return <TrackSearchResponse data={message.text} />
        } else if (message.type === 'travel_advice_response' && typeof message.text === 'object') {
            return <TravelAdviceResponse data={message.text} /> // <-- (MỚI)
        }

        // Dump JSON nếu là object
        if (typeof message.text === 'object' && message.text !== null) {
            try {
                return <pre className='text-xs whitespace-pre-wrap'>{JSON.stringify(message.text, null, 2)}</pre>
            } catch (e) {
                return '[Lỗi hiển thị dữ liệu]'
            }
        }
        // Xử lý xuống dòng \n
        return String(text)
            .split('\n')
            .map((line, index) => (
                <span key={index}>
                    {line}
                    <br />
                </span>
            ))
    }

    return (
        <div className={`flex items-center gap-2 ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
            <div
                className={`w-7 h-7 rounded-full ${
                    // (ĐÃ SỬA) Nền xám cho bot, nền xanh cho user
                    isBot ? 'bg-slate-300' : 'bg-blue-600'
                } flex items-center justify-center`}
            >
                {isBot ? (
                    <FontAwesomeIcon icon={faRobot} className='w-4 h-4 text-gray-700' />
                ) : (
                    // (ĐÃ SỬA) Icon user màu trắng
                    <FontAwesomeIcon icon={faUser} className='w-4 h-4 text-white' />
                )}
            </div>
            <div
                className={`p-3 rounded-2xl max-w-[90%] break-words shadow-sm
        ${isBot ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}
            >
                {renderText(message.text)}
            </div>
        </div>
    )
}

export default Message
