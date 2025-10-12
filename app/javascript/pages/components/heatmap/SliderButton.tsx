function SliderButton(
  { 
    activeTab, 
    setActiveTab, 
    options
  }: 
  { 
    activeTab: string, 
    setActiveTab: (tab: string) => void, 
    options: string[],
  }) 
  { 
  
  return (
    <div className="flex justify-start mb-2 mt-0">
      <nav className="bg-gray-200 rounded-md px-1 py-[0.16rem] w-[210px] shadow-sm">
        <ul className="flex text-gray-600 gap-1 text-xs cursor-pointer">
          <div className="relative flex w-[100%] cursor-pointer h-[100%]">
            {/* Slider background */}
            <span className={`absolute cursor-pointer left-0 top-0 py-[0.2rem] h-full
              ${options?.length < 3 ? 'w-1/2' : 'w-1/3'} bg-white rounded-md shadow transition-transform duration-300 ease-in-out !font-bold`}
              style={{
              transform: `${options && options.length < 3 ? 
                `translateX(${activeTab === options[0]?.toLowerCase() ? '0%' : '100%'})` : 
                `translateX(${activeTab === options[0]?.toLowerCase() ? '0%' : activeTab === options[1]?.toLowerCase() ? '100%' : '200%'})`}`,
              zIndex: 0,
              }}
            />
            <li 
              className=" hover:text-black !cursor-pointer py-[0.2rem] relative
              flex mx-auto z-10 w-1/3 rounded-md text-center justify-center align-middle items-center h-full" 
              onClick={() => setActiveTab(options ? options[0].toLowerCase() : 'quiz')}
            >
              {options ? options[0] : 'Quiz'}
            </li>
            <li className="hover:text-black cursor-pointer py-[0.2rem] relative 
              flex mx-auto z-10 w-1/3 rounded-md text-center justify-center align-middle items-center" 
              onClick={() => setActiveTab(options ? options[1].toLowerCase() : 'study')}
            >
              {options ? options[1] : 'Study'}
            </li>

            {options && options.length < 3 ? null :
              <li className="hover:text-black cursor-pointer py-[0.2rem] relative 
                flex mx-auto z-10 w-1/3 rounded-md text-center justify-center align-middle items-center" 
                onClick={() => setActiveTab(options ? options[2].toLowerCase() : 'combined')}
              >
                {options ? options[2] : 'Combined'}
              </li>}
        </div>
      </ul>
    </nav>
  </div>
)}

export default SliderButton