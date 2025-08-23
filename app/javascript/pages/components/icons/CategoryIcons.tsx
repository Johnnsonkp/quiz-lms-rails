function CategoryIcons({ firstLetter, active }: { firstLetter: string | null, active: boolean | null }) {
  return (
    <button className={`${active && "text-blue-500 border-blue-500"} px-[5.5px] py-[2px] text-xs border-1 rounded-full flex`}>{firstLetter?.toUpperCase()}</button>
  )
}

export default CategoryIcons