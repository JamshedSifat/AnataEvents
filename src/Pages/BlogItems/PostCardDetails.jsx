import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';

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

      const savedBlogs = localStorage.getItem('blogs');
      const blogs = savedBlogs ? JSON.parse(savedBlogs) : [];

      const foundBlog = blogs.find(b => b._id === id);
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
        <a href="/blog" className="btn btn-primary">
          Back to Blogs
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <a href="/blog" className="btn btn-ghost gap-2 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </a>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Featured Image */}
          <figure className="mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </figure>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <span>{blog.author}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gray-100 p-6 rounded-lg mb-12">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Share2 className="w-5 h-5" />
              Share this article:
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="btn btn-sm btn-outline gap-2"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="btn btn-sm btn-outline gap-2"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="btn btn-sm btn-outline gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="btn btn-sm btn-outline gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="pt-12 border-t-2 border-gray-200">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <a key={relatedBlog._id} href={`/blog/${relatedBlog._id}`}>
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <span className="badge badge-primary text-xs mb-2">
                          {relatedBlog.category}
                        </span>
                        <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-primary text-sm">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(relatedBlog.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default PostCardDetails;