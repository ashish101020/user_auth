import Register from './components/Register';
import Login from './components/Login';
import { Route, Routes } from "react-router-dom";
import Dashboard from './components/Dashboard';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from "react-router-dom";

function App() {

  const { user } = useContext(AuthContext);
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={user ? <Dashboard/> : <Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/dashboard' element={user ? <Dashboard/> : <Navigate to='/'/>}/>
      </Routes>
    </div>
  );
}

export default App;
