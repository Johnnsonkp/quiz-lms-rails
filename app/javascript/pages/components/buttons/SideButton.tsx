import React from 'react'

export function SideButton({ showSidebar, setShowSidebar }: { showSidebar: boolean, setShowSidebar: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <button 
      onClick={() => setShowSidebar(!showSidebar)}
      className={`
        p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
        transition-all duration-200 ease-in-out cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${!showSidebar ? 'ml-auto' : ''}
      `}
      aria-label={showSidebar ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`
          w-5 h-5 transition-transform duration-300 ease-in-out
          ${!showSidebar ? 'rotate-180' : ''}
        `}
      >
        <path d="M3.75 8.5C3.75 8.08579 4.08579 7.75 4.5 7.75H5.75C6.16421 7.75 6.5 8.08579 6.5 8.5C6.5 8.91421 6.16421 9.25 5.75 9.25H4.5C4.08579 9.25 3.75 8.91421 3.75 8.5ZM3.75 12C3.75 11.5858 4.08579 11.25 4.5 11.25H5.75C6.16421 11.25 6.5 11.5858 6.5 12C6.5 12.4142 6.16421 12.75 5.75 12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12ZM3.75 15.5C3.75 15.0858 4.08579 14.75 4.5 14.75H5.75C6.16421 14.75 6.5 15.0858 6.5 15.5C6.5 15.9142 6.16421 16.25 5.75 16.25H4.5C4.08579 16.25 3.75 15.9142 3.75 15.5ZM4.25 3C2.45507 3 1 4.45507 1 6.25V17.75C1 19.5449 2.45508 21 4.25 21H19.75C21.5449 21 23 19.5449 23 17.75V6.25C23 4.45507 21.5449 3 19.75 3H4.25ZM19.75 19.5H9V4.5H19.75C20.7165 4.5 21.5 5.2835 21.5 6.25V17.75C21.5 18.7165 20.7165 19.5 19.75 19.5ZM4.25 4.5H7.5V19.5H4.25C3.2835 19.5 2.5 18.7165 2.5 17.75V6.25C2.5 5.2835 3.2835 4.5 4.25 4.5Z"></path>
      </svg>
    </button>
  )
}
