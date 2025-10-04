function UserStatsCard({user}: any) {
  return (
    <div className="flex-[0.34] bg-[#f0feff] justify-center items-center shadow-sm">
      <div className="rounded-lg w-[100%] overflow-hidden bg-white">
        <div className="card w-[100%]">
            <div className="w-[100%] flex align-middle items-center justify-between px-1">

                <div className="m-auto p-3 w-18 h-18 bg-indigo-600 rounded-full flex items-center justify-center">
                  <h3 className="text-white font-bold text-2xl">
                    {user && user?.name ? user.name[0] : ''}
                  </h3>
                </div>

                <div className="col-span-3 p-3 w-[70%]">
                    <div className="font-bold">{user && user?.name ? user.name : ''}</div>
                    <div className="mb-3 text-sm font-light">{user && user?.email ? user.email : ''}</div>
                    <div
                        className="card flex justify-between items-center text-gray-500 bg-[#EEEEEE] focus:bg-white rounded-lg p-1">
                        <div className="text-center">
                            <p className="text-sm">Streak</p>
                            <p className="font-bold text-gray-800">37</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm">Level</p>
                            <p className="font-bold text-gray-800">850</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm">Ave. Rating</p>
                            <p className="font-bold text-gray-800 flex gap-1">
                              9.5
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default UserStatsCard