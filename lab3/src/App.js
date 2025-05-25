import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { BasketProvider } from './context/Basket_context';
import About_us from './pages/About_us';
import Basket from './pages/Basket';
import Discounts from './pages/Discounts';
import Products from './pages/Products';
import User_profile from './pages/User_profile';
import './App.css';

function App() {
  return (
      <BasketProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/about-us" element={<About_us />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/products" element={<Products />} />
                <Route path="/user-profile" element={<User_profile />} />
                <Route path="/" element={<Products />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BasketProvider>
  );
}

export default App;