import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { Dashboard_Route } from "./dashboard_route/Dshboard_Route";

export const Main_Route = createBrowserRouter([
    {
        path:"/",
        Component:App,
        children:[
                ...Dashboard_Route,
            
        ]
    }
])