import React from "react";
import Layout from "./components/Layout/Layout";
import ProductList from "./pages/Products/ProductList";
//import ForgotPassword from './components/ForgotPassword/ForgotPassword';
//import EnterOTP from "./components/ForgotPassword/EnterOTP"; 
//import NewPassword from "./components/ForgotPassword/NewPassword";
import ForgotPasswordFlow from "./components/ForgotPassword/ForgotPasswordFlow";

function App() {

  return (
    <div className="App">
      <ForgotPasswordFlow />
    </div>
  );

  /*return (
    <div className="App">
      <EnterOTP />
    </div>
  );

  return (
    <div className="App">
      <NewPassword />
    </div>
  );
*/
  return (
    <Layout>
      <ProductList />
    </Layout>
  );

   
}

export default App;
