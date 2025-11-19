import {
    AdviceResponse,
    ApiResponse,
    BasicApi,
    ChatBody,
    ChatResponse,
    MultiTurnChatBody,
    TestConnectionResponse
} from '~/types/aiTypes'
import http from '~/utils/http'

export const aiChatApi = {
    postBasicChat: (body: ChatBody) => http.post<ApiResponse<BasicApi>>('/ai/chat', body),

    postTravelAdvice: (body: { topic: string }) => http.post<AdviceResponse>('/ai/travel-advice', body),

    postFamilyTravel: (body: ChatBody) => http.post<ApiResponse<BasicApi>>('/ai/chat', body),

    postBusinessTravelPlanning: (body: ChatBody) => http.post<ApiResponse<BasicApi>>('/ai/chat', body),

    postMultiTurnConversation: (body: MultiTurnChatBody) => http.post<ChatResponse>('/ai/chat', body),

    testAiConnection: () => http.get<TestConnectionResponse>('/ai/test-connection')
}
