import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PanierProvider } from "./Context/PanierContext";
import Home from "./Pages/Home";
import Catalogue from "./Pages/Catalogue";
import Inscription from "./Pages/Inscription";

import Panier from "./Pages/Panier";
import Login from "./Pages/Login";

function App() {
  return (
    <PanierProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path='/home' element={<Home />} />
          <Route path='/catalogue' element={<Catalogue />} />
          <Route path='/inscription' element={<Inscription />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/panier' element={<Panier />} />
        </Routes>
      </Router>
    </PanierProvider>
  );
}

export default App;
