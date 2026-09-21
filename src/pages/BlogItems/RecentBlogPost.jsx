// File: src/Components/RecentPosts/RecentPosts.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const RecentBlogPosts = ({ limit = 5, columns = 1 }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    try {
      setLoading(true);

      // ✅ Load from localStorage
      let data = [];
      const savedBlogs = localStorage.getItem('blogs');
      
      if (savedBlogs) {
        data = JSON.parse(savedBlogs);
      }

      setBlogs(data.slice(0, limit));
      setLoading(false);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Recent Posts</h3>
        <div className="flex items-center justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Recent Posts</h3>
        <p className="text-gray-500 text-center py-4">No posts available</p>
      </div>
    );
  }

  // ✅ Grid layout: lg 2 columns, others 1 column
  const gridClass = columns === 2 
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4'
    : columns === 3
    ? 'grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4'
    : 'space-y-3 sm:space-y-4';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Recent Posts</h3>
      <div className={gridClass}>
        {blogs.map(blog => (
          <a
            key={blog._id}
            href={`/media/blog/${blog._id}`}
            className="block group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300"
          >
            {/* Blog Image - Optional */}
            {blog.image && (
              <div className="relative overflow-hidden rounded-lg mb-2 h-24 sm:h-32">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Blog';
                  }}
                />
              </div>
            )}

            {/* Blog Title */}
            <h4 className="font-semibold text-gray-900 group-hover:text-primary transition line-clamp-2 text-xs sm:text-sm">
              {blog.title}
            </h4>

            {/* Blog Date */}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            {/* Category Badge - Optional */}
            {blog.category && (
              <span className="inline-block mt-2 text-xs bg-primary text-white px-2 py-1 rounded">
                {blog.category}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentBlogPosts;