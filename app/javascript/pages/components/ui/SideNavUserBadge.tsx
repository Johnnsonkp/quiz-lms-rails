export default function SideNavUserBadge({user}: any) {
  return (
    <div className="mt-auto px-6 py-2 border-t border-gray-200 absolute bottom-0 w-full">
      <button className="flex items-center rounded-lg cursor-pointer">
        <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
          <h3 className="text-white font-normal text-1xl">
            {user && user?.name ? user.name[0] : ''}
          </h3>
        </div>
        <div className="ml-3">
          {/* <p className="text-sm font-normal text-black sidebar-text">{user?.name || 'Unknown User'}</p> */}
          <p className="text-xs font-medium text-gray-400 sidebar-text">{user?.email || 'Unknown Email'}</p>
        </div>
      </button>
    </div>
  )
}
