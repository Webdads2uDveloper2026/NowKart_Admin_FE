import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { Dashboard_Route } from "./dashboard_route/Dshboard_Route";
import Login from "../../pages/login/Login";

export const Main_Route = createBrowserRouter([
    {
        path:"/login",
        Component:Login,
    },

    {
        path:"/",
        Component:App,
        children:[
                ...Dashboard_Route,
            
        ]
    }
])