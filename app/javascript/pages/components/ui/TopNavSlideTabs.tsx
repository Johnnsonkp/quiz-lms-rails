function TopNavSlideTabs() {
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
      <ul className="flex flex-wrap -mb-px">
        <li className="mr-2">
            <a href="#"
                className="inline-block p-4 pb-[0.4rem] rounded-t-lg hover:text-gray-600 hover:border-gray-300 active border-b-2 text-black border-black-600">
                Home
            </a>
        </li>
        <li className="mr-2">
            <a href="#" className="inline-block p-4 pb-[0.4rem] rounded-t-lg  "
                aria-current="page">
                Calendar
            </a>
        </li>
        <li className="mr-2">
            <a href="#"
                className="inline-block p-4 pb-[0.4rem] border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ">
                Results
            </a>
        </li>
      </ul>
    </div>
  )
}

export default TopNavSlideTabs