function CategoryIcons({ firstLetter, active }: { firstLetter: string | null, active: boolean | null }) {
  return (
    <button className={`${active && "text-blue-500 !border-blue-500 border-2"} px-[5.6px] py-[2px] text-xs border-2 border-gray-400 rounded-full flex`}>{firstLetter?.toUpperCase()}</button>
  )
}

export default CategoryIcons