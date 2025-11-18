import { useContext, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AppContext } from '~/contexts/app.context'
import { path } from '~/constants/path'
import { setAccesTokenToLS, setRefreshTokenToLS } from '~/utils/auth'
import { getProfile } from '~/apis/auth.api'

export default function GoogleAuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setIsAuthenticated, setProfile } = useContext(AppContext)

    useEffect(() => {
        // 1. Đọc token từ URL
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')

        console.log('AccessToken:', accessToken)
        if (accessToken) {
            // 2. LƯU TOKEN NGAY LẬP TỨC
            // (Quan trọng nhất: lưu token để các API call sau này sử dụng)
            setAccesTokenToLS(accessToken)
            if (refreshToken) {
                setRefreshTokenToLS(refreshToken)
            }
            setIsAuthenticated(true)

            // 3. LẤY THÔNG TIN PROFILE TỪ BACKEND
            getProfile()
                .then((response) => {
                    const profileData = response.data.data
                    // Xử lý middle_name có thể null
                    setProfile({
                        ...profileData,
                        middle_name: profileData.middle_name || ''
                    } as any)
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error)
                })
                .finally(() => {
                    // Navigate về trang chủ sau khi xử lý xong
                    navigate(path.home)
                })
        } else {
            // Nếu URL không có accessToken
            // Đây là lý do bạn thấy "No token provided"
            navigate(path.login)
        }
        // Chỉ chạy 1 lần khi component mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, navigate, setIsAuthenticated, setProfile])

    // Hiển thị thông báo loading
    return (
        <div className='flex items-center justify-center h-screen'>
            <span className='text-xl'>Đang xử lý đăng nhập...</span>
        </div>
    )
}
