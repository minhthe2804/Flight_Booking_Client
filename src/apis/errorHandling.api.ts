import { TooLongBody } from "~/types/aiTypes"
import http from "~/utils/http"

const ERROR_API_PATH = '/ai'

export const errorHandlingApi = {
    postInvalidMessageEmpty: () => http.post(`${ERROR_API_PATH}/invalid-message-empty`),

    postInvalidMessageTooLong: (body: TooLongBody) => http.post(`${ERROR_API_PATH}/invalid-message-too-long`, body),

    postUnauthorizedRequest: () => http.post(`${ERROR_API_PATH}/unauthorized-request`)
}
