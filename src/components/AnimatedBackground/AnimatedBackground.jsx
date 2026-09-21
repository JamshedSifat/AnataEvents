import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50"></div>
            
            {/* Animated blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-0 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-8000"></div>
            
            {/* Moving particles */}
            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-red-400 rounded-full opacity-30 animate-ping"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 2}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>
        </div>
    );
};

export default AnimatedBackground;