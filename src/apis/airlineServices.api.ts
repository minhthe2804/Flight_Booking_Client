import { ServicePackage } from '~/types/airlineServices.type'
import http from '~/utils/http'

export const airlineServicesApi = {
    getAirlineSerives: (airline_id: number) => http.get<ServicePackage>(`service-packages/airlines/${airline_id}`)
}
