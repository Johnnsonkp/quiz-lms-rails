function QuizListPage({ titles, subject, img, getQuizData, ids }: 
  { 
    titles: string[], 
    subject: string | null, 
    img: string | null, 
    getQuizData?: any,
    ids?: number[] | [] 
  }) {

  const ListTable: React.FC<{titles: string[], subject: string | null, img: string | null}> = ({titles, subject, img, }) => {
    return (
      <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border-2 border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-2 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No.
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quiz Titles
            </th>
          {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
          </th> */}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {titles.map((title, index) => (
          <tr 
            key={index}
            onClick={() => getQuizData(subject, ids)}  
            className="hover:bg-gray-100 cursor-pointer"
          >
            <td className="px-4 py-4 whitespace-nowrap w-2">
              <div className="text-sm text-gray-900">{index + 1}</div>
            </td>

            <td className="px-3 py-4 whitespace-nowrap">
              <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={img || "https://i.pravatar.cc/150?img=1"} alt="" />
                  </div>
                  <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                          {title}
                      </div>
                      <div className="text-sm text-gray-500">
                          {subject || 'General Knowledge'}
                      </div>
                  </div>
              </div>
            </td>

            {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{title}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
    )
  }
  
  return (
    <div>
      {titles && titles?.length > 0 && <ListTable titles={titles} subject={subject} img={img} />}
    </div>
  )
}

export default QuizListPage

