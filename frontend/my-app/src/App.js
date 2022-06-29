import "./App.css";
import React, { useState } from 'react';
import SignIn from './screens/SignInLateral';
import MainPage from './screens/MainPage';
import AddNewActives from './screens/AddNewActive';
import Foot from './components/Foot';
import Nbar from './components/Nbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ManageActives from "./screens/ManageActives";
import RequestedActives from './screens/RequestedActives'
import ReturnActives from './screens/ReturnActives'
import Requests from './screens/Requests'
import MakeRequest from './screens/MakeRequest';
import Historic from './screens/Historic_copy';
import UserHistory from './screens/UserHistory';
import UserProfile from './screens/UserProfile'
import AccRecAtivos from "./screens/accept_refuse_orders/Aceitar_recusar_ativos";
import PedidoDetail from "./screens/accept_refuse_orders/Pedido_detail";
import AcceptOrder from "./screens/accept_refuse_orders/Accept_order";
import RefuseOrder from "./screens/accept_refuse_orders/Refuse_order";
import SplitPagesStats from "./screens/stats/SplitPagesStats";
import Admin from "./screens/Admin"
import NotFoundPage from "./screens/404NotFound.js";
//import BarChartPage from "./screens/stats/BarChartPage";
function App() {
  const [token, setToken] = useState(false || sessionStorage.getItem('token'));
  

  if (!token) {
    return <SignIn setToken={setToken} />
  }

  return (
    <BrowserRouter>
      <Nbar userType={3} />{/*1=NORMAL USER; 2=ADMIN ; 3=GESTOR g */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFoundPage />} />



        <Route path="/pedidos_detail" element={<AccRecAtivos/>}/>
        <Route path="/pedidos_detail/:pedidoID/"  element={<PedidoDetail />} /> 
        <Route path="/pedidos_detail/:pedidoID/accept" element={<AcceptOrder />}/> 
        <Route path="/pedidos_detail/:pedidoID/refuse" element={<RefuseOrder />}/> 
        <Route path="/statspage" element={<SplitPagesStats/>}/>

        
        <Route path="/actives/add" element={<AddNewActives />} />
        <Route path="/manageactives" element={<ManageActives />} />
        <Route path="/requestedactives" element={<RequestedActives />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/makerequest" element={<MakeRequest />} />
        <Route path="/historic/:id" element={<Historic />} />
        <Route path="/actives/returns" element={<ReturnActives />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user/user_history" element={<UserHistory />} />
        <Route path="/user/user_profile" element={<UserProfile />} />
      </Routes>
      <Foot />
    </BrowserRouter>
  );
}

export default App;
