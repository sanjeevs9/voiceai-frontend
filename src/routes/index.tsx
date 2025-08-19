
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/'>
        {/* Public Routes */}
        <Route index element={<Home />} />

        {/* Not found Route */}
        <Route path='*' element={<NotFound />} />
    </Route>

))

const Index = () => {
    return <RouterProvider router={router} />
}

export default Index;