const BASE_URL = "http://localhost:3000";
//const BASE_URL = "https://terabia.onrender.com";
//const CLIENT_URL = "http://localhost:5000";
const CLIENT_URL = {
    MANAGER_PRODUCTS_URL: `${BASE_URL}/manager/products`,
    MANAGER_ADD_PRODUCT_URL: `${BASE_URL}/manager/products/add`,
    MANAGER_EDIT_PRODUCT_URL: `${BASE_URL}/manager/products/edit`,
    MANAGER_STOCK_URL: `${BASE_URL}/manager/stocks`,
    MANAGER_ADD_STOCK_URL: `${BASE_URL}/manager/stocks/create`,
    MANAGER_EDIT_STOCK_URL: `${BASE_URL}/manager/stocks/edit`,
    ADMIN_SUPPLIERS_URL: `${BASE_URL}/admin/supplier`,
    ADMIN_ADD_SUPPLIER_URL: `${BASE_URL}/admin/suppliers/add`,
    ADMIN_EDIT_SUPPLIER_URL: `${BASE_URL}/admin/suppliers/edit`,
    ADMIN_USERS_URL: `${BASE_URL}/admin/users`,
    ADMIN_CUSTOMERS_URL: `${BASE_URL}/admin/customers`,
    MANAGER_CATEGORY_URL: `${BASE_URL}/manager/categories`,
    MANAGER_ADD_CATEGORY_URL: `${BASE_URL}/manager/category/add`,
    MANAGER_ADD_SUBCATEGORY_URL: `${BASE_URL}/manager/subcategory/add`,
    MANAGER_EDIT_SUBCATEGORY_URL: `${BASE_URL}/manager/subcategory/edit`,
    MANAGER_EDIT_CATEGORY_URL: `${BASE_URL}/manager/category/edit`,
    ADMIN_ORDERS_URL: `${BASE_URL}/admin/orders`,
    ADMIN_ADD_ORDERS_URL: `${BASE_URL}/admin/orders/add`,
    ADMIN_ADD_ORDERS_ITEM_URL: `${BASE_URL}/admin/orders_items/add`,
    MANAGER_ADD_STOCK_URL_ByProductId: `${BASE_URL}/manager/stocks/add`,
    PRODUCT_URL: `${BASE_URL}/product`,
    PRODUCTS_URL: `${BASE_URL}/products`,
    SUPPLIER_URL: `${BASE_URL}/admin/suppliers`,
    CUSTOMER_URL: `${BASE_URL}/customer`,
    MANAGER_URL: `${BASE_URL}/manager`    ,
    CART_URL: `${BASE_URL}/cart`,
    SUBCATEGORY_URL: `${BASE_URL}/subcategories`
}

export const {MANAGER_ADD_CATEGORY_URL, MANAGER_ADD_PRODUCT_URL, MANAGER_EDIT_CATEGORY_URL, MANAGER_EDIT_PRODUCT_URL,
    MANAGER_PRODUCTS_URL,MANAGER_URL, ADMIN_ADD_ORDERS_ITEM_URL, ADMIN_ADD_ORDERS_URL, ADMIN_ADD_SUPPLIER_URL, SUBCATEGORY_URL,
    MANAGER_CATEGORY_URL, ADMIN_CUSTOMERS_URL, ADMIN_EDIT_SUPPLIER_URL, ADMIN_ORDERS_URL, ADMIN_SUPPLIERS_URL,
    MANAGER_ADD_STOCK_URL_ByProductId, CART_URL,MANAGER_ADD_SUBCATEGORY_URL, MANAGER_EDIT_SUBCATEGORY_URL,
    ADMIN_USERS_URL, PRODUCTS_URL, PRODUCT_URL, CUSTOMER_URL, SUPPLIER_URL, MANAGER_ADD_STOCK_URL, MANAGER_EDIT_STOCK_URL, MANAGER_STOCK_URL,
} = CLIENT_URL

export default BASE_URL;