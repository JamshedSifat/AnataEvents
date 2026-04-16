// File: src/Componetns/PostCardDetails.jsx (Without utility)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import blogsData from '../../../public/Blog.json';

const PostCardDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogDetail();
  }, [id]);

  const loadBlogDetail = () => {
    try {
      setLoading(true);

      // ✅ Direct localStorage
      let blogs = [];
      const savedBlogs = localStorage.getItem('blogs');
      
      if (savedBlogs) {
        blogs = JSON.parse(savedBlogs);
      } else if (blogsData && Array.isArray(blogsData)) {
        blogs = blogsData;
      }

      // Slug দিয়ে খুঁজুন
      const foundBlog = blogs.find(b => b._id === id);

      if (!foundBlog) {
        console.error('Blog not found with id:', id);
        setLoading(false);
        return;
      }

      setBlog(foundBlog);

      if (foundBlog) {
        const related = blogs
          .filter(b => b.category === foundBlog.category && b._id !== foundBlog._id)
          .slice(0, 3);
        setRelatedBlogs(related);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading blog:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Blog Not Found</h1>
        <p className="text-gray-600 mb-6 text-center">Slug: {id}</p>
        <a href="/media/blog" className="btn btn-primary">
          Back to Blogs
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Back Button */}
        <a href="/media/blog" className="btn btn-ghost btn-sm sm:btn-md gap-2 mb-6 sm:mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </a>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg p-4 sm:p-8 md:p-12">
          {/* Featured Image */}
          <figure className="mb-6 sm:mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 sm:h-64 md:h-96 object-cover"
            />
          </figure>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="badge badge-primary">{blog.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{blog.author}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm sm:prose sm:prose-base md:prose-lg max-w-none mb-12">
            <div className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="pt-8 sm:pt-12 border-t-2 border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <a 
                    key={relatedBlog._id} 
                    href={`/media/blog/${relatedBlog._id}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative overflow-hidden h-40 sm:h-48">
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 flex flex-col flex-grow">
                        <span className="badge badge-primary text-xs mb-2 w-fit">
                          {relatedBlog.category}
                        </span>
                        
                        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition text-sm sm:text-base mb-2 flex-grow">
                          {relatedBlog.title}
                        </h3>

                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-auto">
                          <Calendar className="w-3 h-3" />
                          {new Date(relatedBlog.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Share This Article</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-sm btn-outline">Facebook</button>
              <button className="btn btn-sm btn-outline">Twitter</button>
              <button className="btn btn-sm btn-outline">LinkedIn</button>
              <button className="btn btn-sm btn-outline">Copy Link</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostCardDetails;