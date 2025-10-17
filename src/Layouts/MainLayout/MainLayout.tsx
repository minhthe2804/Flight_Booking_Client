import Footer from '~/components/Footer'
import Header from '~/components/HeaderHome'

interface Props {
    children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    return (
        <div className=''>
            <Header />
            {children}
            <Footer />
        </div>
    )
}
