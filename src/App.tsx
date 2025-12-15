import { Routes, Route} from "react-router"
import Home from "./pages/Home"
import NavBar from "./components/NavBar"
import LevelsPage from "./pages/LevelsPage"
import Edit from "./pages/Edit"
import EditPreview from "./pages/EditPreview"

function App() {

  return (
    <div className="w-full overflow-x-hidden bg-[#0D1721] text-gray-100 text-[0.675rem] lg:text-sm">
    <Routes>
      <Route element={<NavBar />}>
        <Route index element={<Home />}/>
      </Route>  
        <Route path="/edit">
          <Route index element={<Edit />} />
          <Route path="preview" element={<EditPreview />} />
        </Route>
        <Route  path="subject/:subject" element={<LevelsPage />}/>

    </Routes>
    </div>
  )
}

export default App
