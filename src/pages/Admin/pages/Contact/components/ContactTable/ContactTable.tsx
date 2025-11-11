import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Contact } from '../../Contact'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'

interface ContactTableProps {
    contacts: Contact[]
    onEdit: (contact: Contact) => void
    onDelete: (id: number) => void
}

export default function ContactTable({ contacts, onEdit, onDelete }: ContactTableProps) {
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
                                Mã người liên hệ
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Họ và tên đệm
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Tên
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Số điện thoại
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
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <tr key={contact.id} className='hover:bg-gray-50 transition-colors duration-150'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {contact.id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {contact.lastName}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {contact.firstName}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {contact.phone}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowTên sân bayrap text-sm text-gray-700'>
                                        {contact.email}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-green-600 rounded-md text-green-600 hover:text-green-800 transition-colors duration-150 p-2 bg-white'
                                                onClick={() => onEdit(contact)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-5 w-5' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy người liên hệ nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
