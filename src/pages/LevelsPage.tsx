import { useParams } from "react-router"


const LevelsPage = () => {
    const { subject } = useParams()
    const handleFetchNotes = () => {

    }
  return (
    <main className="mx-auto max-w-96 p-10 text-2xl lg:text-sm font-light min-h-screen">
      <h1 >{subject}</h1>
      <form onSubmit={handleFetchNotes} className="max-w-2xs">
        <label htmlFor="level">Level</label>
        <select id="level" className="p-2 text-green-500 outline-none bg-transparent">
          <option value="Form 1">Form 1</option>
          <option value="Form 2">Form 2</option>
          <option value="Form 3">Form 3</option>
          <option value="Form 4">Form 4</option>
          <option value="Form 5">Form 5</option>
          <option value="Form 6" selected>Form 6</option>
        </select>
        <button 
          type="submit"
          className="flex items-center justify-center bg-gray-700 text-white/90 py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform border border-white/40 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-normal w-full"
          aria-label="Log in to your account"
        >
            Get Notes
        </button>
      </form>
    </main>
  )
}

export default LevelsPage