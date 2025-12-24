import { Routes, Route } from 'react-router-dom';
import ImportAllRouters from './routers/AllRouters';
import Layout from "./components/Layout/Layout"; 
import Login from "./pages/Auth/LoginPage";
import Register from "./pages/Auth/RegisterPage";
import ForgotPasswordFlow from "./pages/Auth/ForgotPasswordFlow";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />          
            <Route path="/forgot-password" element={<ForgotPasswordFlow />} />      
            <Route path="/" element={<Layout />}>
                <Route path="/*" element={<ImportAllRouters />} /> 
            </Route>
        </Routes>
    );
}

export default App;