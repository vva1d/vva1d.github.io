import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { BasketProvider } from './context/Basket_context';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/authContext';
import About_us from './pages/About_us';
import Basket from './pages/Basket';
import Discounts from './pages/Discounts';
import Products from './pages/Products';
import User_profile from './pages/User_profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
      <AuthProvider>
        <BasketProvider>
          <WishlistProvider>
            <Router>
              <div className="App">
                <Header /> {/* Навігація тепер тільки в Header */}
                <main>
                  <Routes>
                    <Route path="/about-us" element={<About_us />} />
                    <Route path="/basket" element={<Basket />} />
                    <Route path="/discounts" element={<Discounts />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/user-profile" element={<User_profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Products />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </WishlistProvider>
        </BasketProvider>
      </AuthProvider>
  );
}

export default App;