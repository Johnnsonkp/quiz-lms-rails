function CategoryIcons({ firstLetter, active }: { firstLetter: string | null, active: boolean | null }) {
  return (
    <button 
      className={`${active && "text-blue-500 !border-blue-500 border-2"} text-center items-center h-6 w-6 text-xs border-2 border-gray-400 rounded-full flex justify-center`}
      aria-label="Category Icon"
    >
      {firstLetter?.toUpperCase()}
    </button>
  )
}

export default CategoryIcons

// py-[2px]