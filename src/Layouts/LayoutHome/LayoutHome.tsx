import Footer from '~/components/Footer'
import HeaderHome from '~/components/HeaderHome'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className=''>
      <HeaderHome />
      {children}
      <Footer />
    </div>
  )
}
