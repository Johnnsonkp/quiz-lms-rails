function ViewNoteBtn({onClick}: {onClick: () => void}) {
  return (
    <div className="">
      <button
        onClick={onClick}
        className="mx-2 inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg transition-colors text-sm font-medium shadow-sm cursor-pointer hover:shadow-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        View Quiz Note
      </button>
    </div>
  )
}

export default ViewNoteBtn