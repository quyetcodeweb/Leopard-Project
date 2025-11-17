import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AllRouters from "./routers/AllRouters";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {AllRouters}  {/* ✅ Vẫn dùng AllRouters */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
