// File: BlogCardItem.jsx
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogCardItem = ({ blog, featured = false }) => {
  return (
    <a href={`/media/blog/${blog.slug}`}>
      <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
        featured ? 'lg:flex' : ''
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${
          featured 
            ? 'w-full h-48 sm:h-56 lg:w-1/2 lg:h-auto' 
            : 'w-full h-48'
        }`}>
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary text-xs">{blog.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 sm:p-6 ${
          featured 
            ? 'w-full lg:w-1/2' 
            : 'w-full'
        } flex flex-col justify-between`}>
          {/* Title */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 hover:text-primary transition mb-2">
              {blog.title}
            </h2>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{blog.author}</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-gray-600 line-clamp-2 mb-4 text-xs sm:text-sm">
              {blog.excerpt}
            </p>
          </div>

          {/* Read More Link */}
          <div className="flex items-center text-primary font-semibold hover:gap-2 transition-all text-xs sm:text-sm">
            <span>Read More</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default BlogCardItem;