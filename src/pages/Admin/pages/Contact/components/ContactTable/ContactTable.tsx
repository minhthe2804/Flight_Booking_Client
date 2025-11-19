import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Contact } from '~/apis/contact.api' // Import kiểu Contact
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'

interface ContactTableProps {
    contacts: Contact[]
    isLoading: boolean
    onEdit: (contact: Contact) => void
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 bg-gray-200 rounded w-full'></div>
        </td>
    </tr>
)

export default function ContactTable({ contacts, isLoading, onEdit }: ContactTableProps) {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden mt-6'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                ID
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Họ và Tên
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Email
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Điện thoại
                            </th>

                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {isLoading ? (
                            Array(5)
                                .fill(0)
                                .map((_, idx) => <TableRowSkeleton key={idx} />)
                        ) : contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <tr
                                    key={contact.contact_id}
                                    className='hover:bg-gray-50 transition-colors duration-150'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {contact.contact_id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                                        {contact.last_name} {contact.middle_name} {contact.first_name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {contact.email}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {contact.phone}
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-yellow-600 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                onClick={() => onEdit(contact)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy liên hệ nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
