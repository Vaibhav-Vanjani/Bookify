import { Route,Routes, Outlet } from "react-router-dom";
import MainHeader from "./Pages/MainHeader";
import Cart from "./Pages/Cart";
import Home from './Pages/Home';
import './App.css'
import BookInfo from "./Pages/BookInfo";
import Order from "./Pages/Order";
import Admin from "./Pages/Admin.js";
import NotFound from "./Pages/NotFound.js";
import Form from "./Components/Form.js";
import OrderStatus from "./Components/OrderStatus.js";
import NewBook from "./Components/NewBook.js";
import ListBook from "./Components/ListBook.js";
import BookSearch from './Pages/BookSearch.js'

function App() {

  return (
    <div className="main-container">
      <main>
        <Routes>
          <Route path="/" element={<MainHeader />}>
            <Route index element={<Home />} />
              <Route path="/cart" element={<Outlet />} >
                   <Route index element={<Cart />} ></Route>
                   <Route path="/cart/order" element={<Order />} ></Route>          
              </Route>
            <Route path="/book/:bookid" element={<BookInfo />} />
              <Route path="/admin" element={<Outlet />}>
                <Route index element={<Form />}></Route>
                <Route path="/admin/section" element={<Admin/>}></Route>
                <Route path="/admin/order-status" element={<OrderStatus/>}></Route>
                <Route path="/admin/new-book" element={<NewBook/>}></Route>
                <Route path="/admin/list-book" element={<ListBook/>}></Route>
              </Route>
              BookSearch
            <Route path="/bookSearch/:booksearch" element={<BookSearch/>} />    
            <Route path="*" element={<NotFound />} />       
          </Route>
        </Routes>
      </main>

      <footer className="footer">
        {/* Footer content here */}
      </footer>
    </div>
  );
}

export default App;
