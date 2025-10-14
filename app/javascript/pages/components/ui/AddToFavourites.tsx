function AddToFavourites() {
  return (
    <div className="cursor-pointer">
      <button 
        type="button" 
        data-tooltip-target="tooltip-add-to-favorites" 
        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 cursor-pointer"
      >
        <span className="sr-only"> Add to Favorites </span>
        <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z" />
        </svg>
      </button>
      <div 
        id="tooltip-add-to-favorites" 
        role="tooltip" 
        className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-2 py-1 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300" 
        data-popper-placement="top"
      >
        Add to favorites
        <div className="tooltip-arrow" data-popper-arrow=""></div>
      </div>
    </div>
  )
}

export default AddToFavourites;