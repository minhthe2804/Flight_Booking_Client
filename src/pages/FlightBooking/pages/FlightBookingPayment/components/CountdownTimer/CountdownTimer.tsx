import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

type CountdownTimerProps = {
    initialMinutes?: number
    onExpire?: () => void
}

export default function CountdownTimer({ initialMinutes = 10, onExpire }: CountdownTimerProps) {
    const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60)

    useEffect(() => {
        if (secondsLeft <= 0) {
            return
        }

        const intervalId = setInterval(() => {
            setSecondsLeft((prevSeconds) => prevSeconds - 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [secondsLeft])

    useEffect(() => {
        if (secondsLeft === 0 && onExpire) {
            onExpire()
        }
    }, [secondsLeft, onExpire])

    const formatTime = () => {
        const minutes = Math.floor(secondsLeft / 60)
        const seconds = secondsLeft % 60

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return (
        <div
            className={`flex items-center p-3 mb-8 rounded-lg transition-colors duration-300 ${secondsLeft < 60 && secondsLeft > 0 ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-800'}`}
        >
            {secondsLeft < 60 && secondsLeft > 0 ? (
                <AlertTriangle className='w-5 h-5 mr-3 flex-shrink-0' />
            ) : (
                <Clock className='w-5 h-5 mr-3 flex-shrink-0' />
            )}
            <p className='text-sm'>
                {secondsLeft > 0 ? (
                    <>
                        Vé của bạn sẽ được giữ trong <span className='font-bold'>{formatTime()}</span>. Vui lòng hoàn
                        tất thanh toán của bạn!
                    </>
                ) : (
                    <span className='font-bold'>Đã hết thời gian giữ vé!</span>
                )}
            </p>
        </div>
    )
}
