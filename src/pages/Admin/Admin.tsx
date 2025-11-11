import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
    </svg>
)

export default function Admin() {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)

    return (
        <div className='relative min-h-screen md:flex bg-gray-100 font-sans'>
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 bg-black opacity-50 z-20 md:hidden'
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} />

            <main className='flex-1'>
                <div className='md:hidden flex justify-between items-center p-4 bg-white shadow-md'>
                    <h1 className='text-xl font-bold text-slate-800'>Dashboard</h1>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon className='h-6 w-6 text-white' />
                    </button>
                </div>

                <div className='p-4 md:p-8'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
