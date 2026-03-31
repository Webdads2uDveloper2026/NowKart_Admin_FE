import Category from "../../../pages/category/Category";
import Contact from "../../../pages/contact/Contact";
import Coupon from "../../../pages/coupon/Coupon";
import Currency_Convert from "../../../pages/currency_convert/Currency_Convert";
import Dashboard from "../../../pages/dashboard/Dashboard";
import HoleSales from "../../../pages/hole_sales/HoleSales";
import Orders from "../../../pages/orders/Orders";
import Product_Enquiries from "../../../pages/produc_inquiries/Product_Enquiries";
import Products from "../../../pages/products/Products";
import Users from "../../../pages/users/Users";
import Vendors from "../../../pages/vendors/Vendors";

export const Dashboard_Route = [

    
    {
        path:"/dashboard",
        Component:Dashboard,
    },
    {
        path:"/category",
        Component:Category,
    },
    {
        path:"/products",
        Component:Products,
    },
    {
        path:"/orders",
        Component:Orders,
    },
    {
        path:"/hole-sale",
        Component:HoleSales,
    },
    {
        path:"/product-enquiry",
        Component:Product_Enquiries,
    },
    {
        path:"/contact",
        Component:Contact,
    },
    {
        path:"/users",
        Component:Users,
    },
    {
        path:"/currency-convert",
        Component:Currency_Convert,
    },
    {
        path:"/coupon",
        Component:Coupon,
    },
    {
        path:"/vendors",
        Component:Vendors,
    }
]