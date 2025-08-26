import { Category } from '../../../types/dashboard';
import CategoryIcons from '../icons/CategoryIcons';
import quizIcon from '../../../assets/quiz-icon.png'

function SideNav({categories, handleTopicClick, activeSection}: 
  {
    categories: Category[];
    handleTopicClick: (topic: string) => void;
    activeSection: string;
  }) {
  return (
    <aside className={`bg-white shadow-lg transition-all ease-in-out fixed md:static inset-y-0 left-0 z-50`}>
      <a href="/" className="p-4 flex items-center justify-between border-b border-b-black-100">
        <h1 className={`!text-2xl font-bold text-gray-600 transition-opacity duration-300`}>
          <img src={quizIcon} alt="Quiz Logo" className="w-10 h-10 inline-block ml-2" />
          QLearn
        </h1>
      </a>

      <nav className="py-4">
        <ul className="space-y-2">
          {/* Quiz Topics Section */}
          <li className="pt-1">
            <ul className="space-y-1">
              {categories.map((topic: Category) => (
                <li key={topic.topic} className="relative">
                  <a href="#"
                    className={`flex items-center space-x-3 px-5 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                      activeSection === topic.topic ? 'bg-gray-100' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTopicClick(topic.topic);
                    }}
                  >
                    <div className="flex items-center space-x-3 max-w-55">
                      <CategoryIcons firstLetter={topic.topic.charAt(0)} active={activeSection === topic.topic} />
                      <span className={`text-gray-700 text-sm transition-opacity duration-300`}>
                        {topic.topic}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideNav