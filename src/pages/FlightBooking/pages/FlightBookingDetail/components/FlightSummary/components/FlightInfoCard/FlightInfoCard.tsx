import { faPlaneUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flight } from "~/types/searchFlight.type";
import { formatCustomDate, formatDuration, formatFlightTimeOnly } from "~/utils/utils";

// Component con (Card hiển thị 1 chuyến bay)
export const FlightInfoCard: React.FC<{ flight: Flight; title: string }> = ({ flight, title }) => (
    <div>
        <h3 className='text-md font-semibold text-blue-700 mb-2 border-b pb-2'>{title}</h3>
        <p className='font-semibold text-gray-800'>
            {flight.airline.name} ({flight.flight_number})
        </p>
        <p className='text-sm text-gray-500'>{formatCustomDate(flight.departure.time?.substring(0, 10))}</p>
        <div className='flex items-center justify-between mt-2 text-sm'>
            <div className='flex flex-col items-start'>
                <p className='font-bold'>{formatFlightTimeOnly(flight.departure.time)}</p>
                <p className='text-gray-600'>{flight.departure.airport.code}</p>
            </div>
            <div className='flex flex-col items-center text-xs text-gray-500 mx-2'>
                <span>{formatDuration(flight.duration)}</span>
                <div className='w-full h-px bg-gray-300 my-1 relative'>
                    <FontAwesomeIcon
                        icon={faPlaneUp}
                        className='text-[10px] text-blue-600 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1'
                    />
                </div>
                <span className='text-[10px]'>Bay thẳng</span>
            </div>
            <div className='flex flex-col items-end'>
                <p className='font-bold'>{formatFlightTimeOnly(flight.arrival.time)}</p>
                <p className='text-gray-600'>{flight.arrival.airport.code}</p>
            </div>
        </div>
    </div>
)
