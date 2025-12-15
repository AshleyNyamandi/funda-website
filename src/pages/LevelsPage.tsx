import { useParams } from "react-router"


const LevelsPage = () => {
    const { subject } = useParams()
  return (
    <h1 className="text-center text-2xl lg:text-2xl font-light">{subject}</h1>
  )
}

export default LevelsPage