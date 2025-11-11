import { Promotion } from '~/types/promotion'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

const URL_PROMOTION = '/promotions'

export const promotionApi = {
    getPromotion: () => http.get<SuccessResponse<Promotion[]>>(URL_PROMOTION)
}
