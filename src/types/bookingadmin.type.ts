import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'

export type BookingFilter = Pick<FlightQueryConfig, 'page' | 'limit' | 'status'>
