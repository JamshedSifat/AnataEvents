import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogCardItem = ({ blog, featured = false }) => {
  return (
    <a href={`/blog/${blog._id}`}>
      <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
        featured ? 'md:flex' : ''
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/3 h-64 md:h-auto' : 'w-full h-48'}`}>
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
        <div className={`p-6 ${featured ? 'md:w-2/3' : 'w-full'} flex flex-col justify-between`}>
          {/* Title */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-2 hover:text-primary transition mb-2">
              {blog.title}
            </h2>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
              {blog.excerpt}
            </p>
          </div>

          {/* Read More Link */}
          <div className="flex items-center text-primary font-semibold hover:gap-2 transition-all text-sm">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default BlogCardItem;