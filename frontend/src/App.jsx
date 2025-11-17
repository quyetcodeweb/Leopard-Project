import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AllRouters from "./routers/AllRouters";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {AllRouters}
      </Route>
    </Routes>
  );
}

export default App;
