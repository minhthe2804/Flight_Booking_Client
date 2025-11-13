import { FlightQueryConfig } from "~/hooks/useSearchFlightQueryConfig";

export type ContactFilter = Pick<
  FlightQueryConfig,
  'page' | 'limit' | 'first_name' | 'last_name' | 'phone' | 'email' | 'citizen_id'
>