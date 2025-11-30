import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings, Profile, Cart, Chat, Map, Settings, Notification } from './components';
import { useStateContext } from './contexts/ContextProvider';
import RequireAuth from './pages/authMiddleware/RequireAuth';
import RequireManager from './pages/authMiddleware/RequireManager';
import RequireAdmin from './pages/authMiddleware/RequireAdmin';
import {
  Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, ColorPicker, Area, Kanban, Line, Customers,
  Editor, Pie, Bar, Financial, ColorMapping, AddCategory, AdminCategory, AdminProduct, Register, Login,
  AdminUser, Home, AdminAddSupplier, AdminEditSupplier, Products, Product, AdminSupplier, AdminAddStock,
  AdminStock, AdminEditStock, AdminEditProduct, AdminAddProduct, AdminAddStockByProductId, PurchaseCart,
  AdminOrder, AdminCustomer, AdminOrderItem, AdminAddCategory, AdminEditCategory, AdminProductCategory,
  Categories, EditCategory, SubCategories
} from './pages';

function App() {
  const { activeMenu, screenSize, isClicked } = useStateContext();

  const isSmallScreen = screenSize <= 768; // Threshold for small screen detection

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <div className=" mt-2 flex relative dark:bg-main-dark-bg">
          <div className="absolute top-[85vh] right-4" style={{ zIndex: 1000 }}>
            <button
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              style={{ background: 'blue', borderRadius: '50%' }}
            >
              <FiSettings />
            </button>
          </div>
        </div>
        {activeMenu ? (
          <div
            className="w-72 fixed dark:bg-secondary-dark-bg bg-white"
            style={{
              zIndex: isSmallScreen ? 1050 : 100,
            }}
          >
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg"></div>
        )}

        <div
          className={`${
            activeMenu 
              ? "relative md:ml-[32%] lg:ml-[25%] xl:ml-[22%] 2xl:ml-[17%]"
              : "relative"
          }`}
          style={{
            zIndex: isSmallScreen && activeMenu  ? 100 : 0,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ecommerce" element={<Orders />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/color-picker" element={<ColorPicker />} />
            <Route path="/line" element={<Line />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/color-mapping" element={<ColorMapping />} />
            <Route path="/pyramid" element={<Pyramid />} />
            <Route path="/stacked" element={<Stacked />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products/:category" element={<Products />} />
            <Route path="/product" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/purchase-cart" element={<PurchaseCart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/subcategories" element={<SubCategories />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>

          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/orders" element={<Orders />} />
              
            </Route>

            <Route element={<RequireManager />}>
              {/* Manager-specific routes */}
              <Route path="/manager/product-category/add" element={<AddCategory />} />
              <Route path="/manager/product-category" element={<AdminCategory />} />
              <Route path="/manager/products" element={<AdminProduct />} />
              <Route path="/manager/products/add" element={<AdminAddProduct />} />
              <Route path="/manager/products/edit" element={<AdminEditProduct />} />
              <Route path="/manager/stocks" element={<AdminStock />} />
              <Route path="/manager/stocks/create" element={<AdminAddStock />} />
              <Route path="/manager/stocks/edit/:stockId" element={<AdminEditStock />} />
              <Route path="/manager/category/add" element={<AdminAddCategory />} />
              <Route path="/manager/categories" element={<AdminCategory />} />
              <Route path="/manager/category/edit/:categoryId" element={<AdminEditCategory />} />
              <Route path="/manager/product-categories" element={<AdminProductCategory />} />
              <Route path="/manager/subcategory/add" element={<AddCategory />} />
              <Route path="/manager/subcategory/edit/:categoryId" element={<EditCategory />} />
              <Route path="/manager/stocks/add" element={<AdminAddStockByProductId />} />
              <Route path="/manager/stocks/add/:productId" element={<AdminAddStockByProductId />} />
              <Route path="/manager/orders" element={<AdminOrder />} />
              <Route path="/manager/customers" element={<AdminCustomer />} />
              <Route path="/manager/order-items" element={<AdminOrderItem />} />
            </Route>

            <Route element={<RequireAdmin />}>
              {/* Admin-specific routes */}
              <Route path="/admin/users" element={<AdminUser />} />
              <Route path="/admin/suppliers" element={<AdminSupplier />} />
              <Route path="/admin/suppliers/promote/:id" element={<AdminAddSupplier />} />
              <Route path="/admin/suppliers/edit" element={<AdminEditSupplier />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
