// File: src/Componetns/PostCard.jsx (Without utility)
import React, { useState, useEffect } from 'react';
import { Search, Calendar, User } from 'lucide-react';
import BlogCardItem from './BlogCardItem';
import blogsData from '../../../public/Blog.json';

const PostCard = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    try {
      setLoading(true);

      // ✅ Direct localStorage
      let data = [];
      const savedBlogs = localStorage.getItem('blogs');
      
      if (savedBlogs) {
        data = JSON.parse(savedBlogs);
      } else if (blogsData && Array.isArray(blogsData)) {
        data = blogsData;
        localStorage.setItem('blogs', JSON.stringify(data));
      }

      setBlogs(data);
      setFilteredBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

  useEffect(() => {
    let filtered = blogs;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, selectedCategory, blogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Stay updated with the latest event management tips, trends, and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Featured Blogs */}
            {filteredBlogs.filter(blog => blog.featured).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Featured</h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {filteredBlogs.filter(blog => blog.featured).map(blog => (
                    <BlogCardItem key={blog._id} blog={blog} featured={true} />
                  ))}
                </div>
              </div>
            )}

            {/* All Blogs */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
                {selectedCategory !== 'All' ? selectedCategory + ' Articles' : 'Latest Articles'}
              </h2>

              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {filteredBlogs.map(blog => (
                    <BlogCardItem key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-base sm:text-lg text-gray-600">
                    No blogs found. Try a different search or category.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-sm sm:input-md input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Recent Posts</h3>
              <div className="space-y-3 sm:space-y-4">
                {blogs.slice(0, 5).map(blog => (
                  <a
                    key={blog._id}
                    href={`/media/blog/${blog._id}`}
                    className="block group"
                  >
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition line-clamp-2 text-xs sm:text-sm">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Archive */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Archive</h3>
              <div className="space-y-2">
                {['April 2024', 'March 2024', 'February 2024', 'January 2024'].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="block text-xs sm:text-sm text-primary hover:underline"
                  >
                    {month}
                  </a>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-3">Latest News</h3>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                Subscribe to our newsletter to get the latest event management tips delivered to your inbox.
              </p>
              <button className="w-full btn btn-sm btn-outline text-white hover:bg-white hover:text-primary">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;