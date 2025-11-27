


const BASE_URL = "https://terabia-api.onrender.com";
const SU = "https://terabia-api.onrender.com/api/v1";

//const BASE_URL = "http://localhost:5000";
//const SU = "http://localhost:5000/api/v1";

const SERVER_URL = {
    REGISTER_URL: `${SU}/auth/register`,
    LOGIN_URL: `${SU}/auth/authenticate`,
    USERS_URL : `${SU}/users`,
    PRODUCT_CATEGORY_URL : `${SU}/product_categories`,
    CATEGORY_URL: `${SU}/categories`,
    PRODUCT_URL : `${SU}/products`,
    STOCK_URL: `${SU}/stocks`,
    PRODUCT_STOCK: `${SU}/stocks/add`,
    ORDER_URL : `${SU}/orders`,
    ORDER_ITEM_URL : `${SU}/orders/order-items`,
    SUPPLIER_URL: `${SU}/suppliers`,
    STATUS_URL: `${SU}/statuses`,
    CUSTOMER_URL: `${SU}/customers`,
    MOVEMENT_TYPE_URL: `${SU}/movement-types`,
    SUBCATEGORY_URL: `${SU}/product_categories/subcategories`,
}

export const  {REGISTER_URL, LOGIN_URL, SUBCATEGORY_URL, MOVEMENT_TYPE_URL, CUSTOMER_URL, CATEGORY_URL, STATUS_URL, USERS_URL, PRODUCT_CATEGORY_URL, PRODUCT_URL, STOCK_URL, ORDER_URL, ORDER_ITEM_URL, SUPPLIER_URL} = SERVER_URL;
//console.log(USERS_URL, BASE_URL);
export default BASE_URL;