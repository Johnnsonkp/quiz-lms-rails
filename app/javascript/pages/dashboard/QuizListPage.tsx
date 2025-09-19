function QuizListPage({ titles, subject, img, getQuizData, ids, quizList }: 
  { 
    titles: string[], 
    subject: string | null, 
    img: string | null, 
    getQuizData?: any,
    ids?: number[] | []
    quizList?: {id: number, title: string}[] | [] | any 
  }) {

  const handleGetQuizData = (subject: string | null, title: string, quizList: {id: number, title: string}[]) => {
    if(!subject || !title || !quizList) return;
    
    const id = quizList?.find(q => q.title === title)?.id;
    if(!id) return;

    getQuizData(subject, id);
  }

  const ListTable: React.FC<{titles: string[], subject: string | null, img: string | null, quizList: {id: number, title: string}[]}> = 
  ({
      titles, 
      subject, 
      img,
      quizList
  }) => {
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
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {titles.map((title, index) => (
          // const id = 
          <tr key={index}
            // onClick={() => getQuizData(subject, ids)}  
            onClick={() => handleGetQuizData(subject, title, quizList)}  
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
          </tr>
        ))}
      </tbody>
    </table>
    )
  }
  
  return (
    <div>
      {titles && titles?.length > 0 && 
        <ListTable 
          titles={titles} 
          subject={subject} 
          img={img}
          quizList={quizList || []}
        />}
    </div>
  )
}

export default QuizListPage

