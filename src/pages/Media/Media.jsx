// File: src/Pages/Media/Media.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Image, BookOpen, Play } from 'lucide-react';
import Gallery from '../../components/Gallary/Gallary';
import BlogCardItem from '../BlogItems/BlogCardItem';
import MediaVideo from './MediaVideo/MediaVideo';

const Media = () => {
  const location = useLocation();

  // Determine active tab based on route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('gallery')) return 'gallery';
    if (path.includes('blog')) return 'blog';
    if (path.includes('video')) return 'video';
    return 'home'; // default
  };

  const activeTab = getActiveTab();

  const tabs = [
    { 
      id: 'gallery', 
      label: 'Gallery', 
      path: '/media/gallery',
      icon: <Image className="w-6 h-6" />
    },
    { 
      id: 'blog', 
      label: 'Blog', 
      path: '/media/blog',
      icon: <BookOpen className="w-6 h-6" />
    },
    { 
      id: 'video', 
      label: 'Videos', 
      path: '/media/video',
      icon: <Play className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our <span className="text-primary">Media</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our gallery, blog, and videos showcasing our amazing events and services
          </p>
        </div>

        {/* Media Cards - Home View */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  {/* Card Header with Icon */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-white">
                      {tab.icon}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col items-center justify-center min-h-40">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {tab.label}
                    </h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                      {tab.id === 'gallery' && 'Browse our stunning event photography collection'}
                      {tab.id === 'blog' && 'Read latest event management tips and insights'}
                      {tab.id === 'video' && 'Watch event highlights and behind-the-scenes content'}
                    </p>
                    <button className="btn btn-primary btn-sm group-hover:btn-secondary transition-all">
                      Explore {tab.label}
                    </button>
                  </div>

                
                </div>
              </NavLink>
            ))}
          </div>
        )}

        {/* Tabs Navigation - Sub Pages */}
        {activeTab !== 'home' && (
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="flex gap-2 sm:gap-4 bg-white rounded-lg shadow-md p-2 sm:p-3">
              {/* Back Button */}
              <NavLink
                to="/media"
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
              >
                ← Back
              </NavLink>

              {/* Tab Links */}
              {tabs.map((tab) => (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={({ isActive }) =>
                    `px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`
                  }
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Content Area - Sub Pages */}
        {activeTab !== 'home' && (
          <div className="animate-fade-in">
            {/* Lazy load components only when needed */}
            {activeTab === 'gallery' && <Gallery />}
            {activeTab === 'blog' && <BlogCardItem/>}
            {activeTab === 'video' && <MediaVideo />}
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Gallery Page Component
const GalleryPage = () => {
  const Gallery = React.lazy(() => import('../../components/Gallary/Gallary'));
  
  return (
    <React.Suspense fallback={<div className="text-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <Gallery />
    </React.Suspense>
  );
};

// ✅ Blog Page Component
const BlogPage = () => {
  const PostCard = React.lazy(() => import('../../pages/BlogItems/BlogCardItem'));
  
  return (
    <React.Suspense fallback={<div className="text-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <BlogCardItem />
    </React.Suspense>
  );
};

// ✅ Video Page Component
const VideoPage = () => {
  const MediaVideo = React.lazy(() => import('./MediaVideo/MediaVideo'));
  
  return (
    <React.Suspense fallback={<div className="text-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <MediaVideo />
    </React.Suspense>
  );
};

export default Media;