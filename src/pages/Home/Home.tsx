import BestFlightDeals from '~/components/BestFlightDeals/BestFlightDeals'
import DomesticFlights from '~/components/DomesticFlights/DomesticFlights'
import PromotionHome from '~/components/PromotionHome'

export default function Home() {
    return (
        <div className=''>
            <div className='max-w-[1278px] mx-auto'>
                <figure className='w-full h-[278px] rounded-md mt-10'>
                    <img
                        src='https://ik.imagekit.io/tvlk/image/imageResource/2025/11/03/1762154575348-43ed95fc0c03e09cb845611a20d993b0.jpeg?tr=q-75,w-1280'
                        alt=''
                        className='rounded-md'
                    />
                </figure>
                <div className='mt-[60px]'>
                    <PromotionHome />
                </div>

                <BestFlightDeals />
            </div>
        </div>
    )
}
