# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# clear existing data
# Quiz.destroy_all
# Question.destroy_all
# Quiz.destroy_all


quiz_1 = Quiz.create!(
  title: "React Hooks Basics",
  description: "A quiz about common React hooks",
  topic: "Canva Interview",
  subject: "React"
)

quiz_1.questions.create!(
  external_id: "react001",
  question_format: "multiple_choice",
  question: "What does the `useEffect` hook do in React?",
  answer: "It performs side effects in function components...",
  incorrect_answers: ["It replaces the need for props.", "It is used only for styling components.", "It updates the Redux store automatically."],
  hint: "Think about lifecycle methods...",
  explanation: "useEffect combines componentDidMount...",
  difficulty: "intermediate",
  estimated_time_seconds: 45,
  tags: ["react", "hooks", "useEffect"],
  path: "canva/react/hooks"
)

quiz_1.questions.create!(
  external_id: "react002",
  question_format: "multiple_choice",
  question: "What is the purpose of the `useState` hook in React?",
  answer: "It allows functional components to have local state.",
  incorrect_answers: [
    "It sends API requests automatically.",
    "It manages global state across the app.",
    "It replaces Redux for state management."
  ],
  hint: "Consider how you store and update values inside functional components.",
  explanation: "`useState` is a React hook that enables stateful logic in functional components by returning a state variable and a function to update it.",
  difficulty: "intermediate",
  estimated_time_seconds: 45,
  tags: ["react", "hooks", "useState"],
  path: "canva/react/hooks"
)

quiz_1.questions.create!(
  external_id: "react003",
  question_format: "multiple_choice",
  question: "What is the primary use of the `useContext` hook in React?",
  answer: "To access the current value of a React context without needing a Consumer component.",
  incorrect_answers: [
    "To create a new context provider.",
    "To store local component state.",
    "To manage asynchronous side effects."
  ],
  hint: "Think about how data is shared deeply in the component tree.",
  explanation: "`useContext` simplifies context consumption by letting you read and subscribe to context directly inside a function component, avoiding nesting of Consumer components.",
  difficulty: "intermediate",
  estimated_time_seconds: 45,
  tags: ["react", "hooks", "useContext"],
  path: "canva/react/hooks"
)

quiz_2 = Quiz.create!(
  title: "Creation",
  description: "A quiz about key concepts from the Book of Genesis",
  topic: "Bible Study",
  subject: "Genesis"
)

quiz_2.questions.create!(
  external_id: "genq001",
  question_format: "multiple_choice",
  question: "What was the first thing God created according to Genesis?",
  answer: "Light.",
  incorrect_answers: ["The earth.", "The animals.", "The sun and moon."],
  hint: "It was the very first act of creation.",
  explanation: "In Genesis 1:3, God said, 'Let there be light,' and there was light.",
  difficulty: "beginner",
  estimated_time_seconds: 30,
  tags: ["genesis", "creation", "bible"],
  path: "bible/genesis/creation"
)
