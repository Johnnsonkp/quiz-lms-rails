import { Category } from '../../../types/dashboard';
import CategoryIcons from '../icons/CategoryIcons';
import Divider from '../divider/Divider';
import quizIcon from '../../../assets/quiz-icon.png'

function SideNav({categories, handleTopicClick, activeSection}: 
  {
    categories: Category[];
    handleTopicClick: (topic: string) => void;
    activeSection: string;
  }) {
  return (
    <aside className={`bg-white h-full transition-all ease-in-out fixed md:static inset-y-0 left-0 z-50`}>
      {/* <a href="/" className="p-4 flex items-center justify-between border-b border-b-black-100"> */}
      <a href="/" className="p-4 flex items-center justify-between">
        <h1 className={`!text-1xl font-bold text-black-500 transition-opacity duration-300`}>
          <img src={quizIcon} alt="Quiz Logo" className="w-8 h-8 inline-block ml-2" />
          QLearn
        </h1>
      </a>

      <Divider />

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