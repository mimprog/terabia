import { FaHouseUser, FaProductHunt } from "react-icons/fa6";
import { FiShoppingBag, FiUsers } from "react-icons/fi";
import { MdApps, MdCategory, MdContacts, MdHome, MdInsertEmoticon, MdOutlineCategory, MdOutlineShoppingCart, MdStore } from "react-icons/md";

export const links = [


   {
        title: 'Pages',
        links: [
            {
                name: 'orders',
                baseUrl: '/manager',
                icon: <MdOutlineShoppingCart />
            },
            {
                name: 'users',
                baseUrl: '/admin',
                icon: <FiUsers/>
            },

            {
                name: 'order-items',
                baseUrl: 'manager',
                icon: <MdInsertEmoticon/>
            },

            {
                name: 'categories',
                baseUrl: '/manager',
                icon: <MdCategory/>
            },

            {
                name: 'product-categories',
                baseUrl: '/manager',
                icon: <MdOutlineCategory/>
            }
        ]
    },

    {
        title: 'Products',
        links: [
            {
                name: 'products',
                baseUrl: '/manager',
                icon: <FaProductHunt/>
            },
            {
                name: 'customers',
                baseUrl: '/manager',
                icon: <FaHouseUser/>
            },
            {
                name: 'suppliers',
                baseUrl: '/admin',
                icon: <MdContacts/>
            },
            {
                name: 'stocks',
                baseUrl: '/manager',
                icon: <MdStore/>
            }
        ]
    },

    {
        title: 'Apps',
        links: [
            {
                name: 'APP_AUth',
                icon: <MdApps/>
            }
        ]
    }


]