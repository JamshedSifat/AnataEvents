import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

const BlogCard = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Wedding', 'Corporate', 'Tips', 'Trends', 'Planning'];

    // Fetch blogs from JSON
    useEffect(() => {
        fetch('/blogs.json')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredBlogs = selectedCategory === 'All' 
        ? blogs 
        : blogs.filter(blog => blog.category === selectedCategory);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="badge badge-primary mb-4">📝 Our Blog</div>
                    <h2 className="text-4xl font-bold mb-4">
                        Latest <span className="text-primary">Event Tips</span> & News
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Expert advice, trending ideas, and insider tips for planning perfect events
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`btn btn-sm ${
                                selectedCategory === category 
                                    ? 'btn-primary' 
                                    : 'btn-outline btn-primary'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            
                            {/* Blog Image */}
                            <figure className="relative overflow-hidden">
                                <img 
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-4 right-4">
                                    <div className="badge badge-primary">{blog.category}</div>
                                </div>
                            </figure>

                            <div className="card-body p-6">
                                
                                {/* Blog Meta */}
                                <div className="flex items-center gap-4 text-sm text-base-content/60 mb-3">
                                    <span className="flex items-center gap-1">
                                        📅 {blog.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        👤 {blog.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        ⏱️ {blog.readTime}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="card-title text-lg mb-3 hover:text-primary transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-base-content/70 mb-4 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.tags.map((tag, index) => (
                                        <span key={index} className="badge badge-outline badge-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Read More Button */}
                                <div className="card-actions">
                                    <NavLink 
                                        to={`/blog/${blog.id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Read More 📖
                                    </NavLink>
                                    
                                    <div className="flex items-center gap-3 text-sm text-base-content/60 ml-auto">
                                        <span className="flex items-center gap-1">
                                            👁️ {blog.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💬 {blog.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {filteredBlogs.length > 6 && (
                    <div className="text-center mt-12">
                        <button className="btn btn-outline btn-primary">
                            Load More Articles 📚
                        </button>
                    </div>
                )}

             
            </div>
        </section>
    );
};

export default BlogCard;