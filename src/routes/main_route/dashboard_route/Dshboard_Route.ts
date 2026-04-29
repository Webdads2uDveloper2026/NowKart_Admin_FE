import Category from "../../../pages/category/Category";
import Contact from "../../../pages/contact/Contact";
import Coupon from "../../../pages/coupon/Coupon";
import Currency_Convert from "../../../pages/currency_convert/Currency_Convert";
import Dashboard from "../../../pages/dashboard/Dashboard";
import HoleSales from "../../../pages/hole_sales/HoleSales";
import Orders from "../../../pages/orders/Orders";
import Product_Enquiries from "../../../pages/produc_inquiries/Product_Enquiries";
import ProductDetailPage from "../../../pages/products/ProductDetails";
import Products from "../../../pages/products/Products";
import SubCategory from "../../../pages/sub_category/SubCategory";
import Users from "../../../pages/users/Users";
import Vendors from "../../../pages/vendors/Vendors";

export const Dashboard_Route = [
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/category",
    Component: Category,
  },
  {
    path: "/subcategory",
    Component: SubCategory,
  },
  {
    path: "/products",
    Component: Products,
  },
  {
    path: "/products/:slug",
    Component: ProductDetailPage,
  },
  {
    path: "/orders",
    Component: Orders,
  },
  {
    path: "/hole-sale",
    Component: HoleSales,
  },
  {
    path: "/product-enquiry",
    Component: Product_Enquiries,
  },
  {
    path: "/contact",
    Component: Contact,
  },
  {
    path: "/users",
    Component: Users,
  },
  {
    path: "/currency-convert",
    Component: Currency_Convert,
  },
  {
    path: "/coupon",
    Component: Coupon,
  },
  {
    path: "/vendors",
    Component: Vendors,
  },
];
