import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'

export type AirlineFilter = Pick<
    FlightQueryConfig,
    'page' | 'limit' | 'airline_code' | 'airline_name' | 'country_id' | 'is_active'
>
