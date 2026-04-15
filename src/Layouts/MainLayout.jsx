import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Componetns/Footer/Footer';
import Navbar from '../Componetns/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';




const MainLayout = () => {
 
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="mt-6">
                <Navbar></Navbar>
            </div>
            <div className="flex-1 mt-6">
                <Outlet />
            </div>
            
            <div className="">
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;