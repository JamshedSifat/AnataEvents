import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                console.log('Fetching blog ID:', id); // Debug log
                
                // Method 1: Single blogs.json file থেকে find করুন
                const response = await fetch('/blogs.json');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                
                const data = await response.json();
                console.log('All blogs data:', data); // Debug log
                
                const foundBlog = data.find(b => b.id === parseInt(id));
                console.log('Found blog:', foundBlog); // Debug log
                
                if (!foundBlog) {
                    throw new Error('Blog not found');
                }
                
                setBlog(foundBlog);
                setAllBlogs(data);
                setLoading(false);
                
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4">Loading blog...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
                <p className="text-base-content/70 mb-4">
                    {error || 'The requested blog article could not be found.'}
                </p>
                <div className="space-x-4">
                    <NavLink to="/blog" className="btn btn-primary">
                        Back to Blog
                    </NavLink>
                    <NavLink to="/" className="btn btn-outline">
                        Go Home
                    </NavLink>
                </div>
            </div>
        );
    }

    // Filter blogs for search
    const filteredBlogs = allBlogs.filter(blogItem =>
        blogItem.title.toLowerCase().includes('') ||
        blogItem.category.toLowerCase().includes('')
    );

    // Get latest blogs
    const latestBlogs = allBlogs
        .filter(b => b.id !== parseInt(id))
        .slice(0, 5);

    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Breadcrumb */}
                <div className="breadcrumbs text-sm mb-8">
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/blog">Blog</NavLink></li>
                        <li className="text-primary">{blog.title}</li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Side - Blog Content */}
                    <div className="lg:col-span-2">
                        
                        {/* Blog Header */}
                        <div className="mb-8">
                            <div className="badge badge-primary mb-4">{blog.category}</div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{blog.title}</h1>
                            
                            {/* Blog Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mb-6">
                                <span className="flex items-center gap-2">
                                    👤 By <strong>{blog.author}</strong>
                                </span>
                                <span className="flex items-center gap-2">
                                    📅 {blog.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    ⏱️ {blog.readTime}
                                </span>
                                <span className="flex items-center gap-2">
                                    👁️ {blog.views} views
                                </span>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="mb-8">
                            <img 
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
                            />
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none mb-8">
                            <div className="text-lg leading-relaxed text-base-content/80">
                                
                                {/* Blog Excerpt */}
                                <p className="text-xl font-medium text-primary mb-6">
                                    {blog.excerpt}
                                </p>
                                
                                {/* Main Content */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-base-content">Introduction</h3>
                                    <p>
                                        Welcome to our comprehensive guide on {blog.category.toLowerCase()} planning. 
                                        In this article, we'll explore the essential elements that make events successful 
                                        and provide you with actionable insights based on our years of experience at Ananta Events.
                                    </p>
                                    
                                    <h3 className="text-2xl font-bold text-base-content">Key Strategies</h3>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Comprehensive planning and timeline management</li>
                                        <li>Budget optimization and cost-effective solutions</li>
                                        <li>Vendor coordination and quality assurance</li>
                                        <li>Guest experience enhancement techniques</li>
                                        <li>Risk management and contingency planning</li>
                                    </ul>
                                    
                                    <h3 className="text-2xl font-bold text-base-content">Professional Tips</h3>
                                    <p>
                                        Based on our extensive experience in the {blog.category.toLowerCase()} industry, 
                                        here are some professional insights that can help you achieve exceptional results. 
                                        Our team has successfully managed hundreds of events and learned valuable lessons 
                                        that we're sharing with you.
                                    </p>
                                    
                                    <div className="bg-base-200 p-6 rounded-lg">
                                        <h4 className="text-lg font-bold text-primary mb-3">Expert Insight</h4>
                                        <p className="italic">
                                            "The key to successful event planning lies in attention to detail and 
                                            proactive communication. Every event is unique, and understanding your 
                                            client's vision is paramount." - {blog.author}
                                        </p>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-base-content">Conclusion</h3>
                                    <p>
                                        Planning successful events requires expertise, dedication, and attention to detail. 
                                        At Ananta Events, we're committed to making your vision a reality. Contact us 
                                        for professional {blog.category.toLowerCase()} planning services.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-8">
                            <h4 className="text-lg font-bold mb-3">Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags && blog.tags.map((tag, index) => (
                                    <span key={index} className="badge badge-primary badge-lg">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Author Card */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <div className="avatar">
                                        <div className="w-16 h-16 rounded-full">
                                            <img 
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                                alt={blog.author} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold">{blog.author}</h4>
                                        <p className="text-base-content/70 text-sm mb-2">
                                            Senior Event Planner at Ananta Events
                                        </p>
                                        <p className="text-sm">
                                            Expert in {blog.category.toLowerCase()} planning with 10+ years 
                                            experience in creating memorable events across Bangladesh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sidebar */}
                    <div className="space-y-8">
                        
                        {/* Latest Articles */}
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body">
                                <h3 className="card-title text-lg mb-4">📰 Latest Articles</h3>
                                <div className="space-y-4">
                                    {latestBlogs.map((latestBlog) => (
                                        <div key={latestBlog.id} className="flex gap-3">
                                            <img 
                                                src={latestBlog.image}
                                                alt={latestBlog.title}
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <NavLink 
                                                    to={`/blog/${latestBlog.id}`}
                                                    className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                                                >
                                                    {latestBlog.title}
                                                </NavLink>
                                                <div className="text-xs text-base-content/60 mt-1">
                                                    {latestBlog.date}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-4">
                                    <NavLink to="/blog" className="btn btn-primary btn-sm w-full">
                                        View All Articles
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="card bg-primary text-white shadow-lg">
                            <div className="card-body text-center">
                                <h3 className="text-lg font-bold mb-2">📧 Subscribe Newsletter</h3>
                                <p className="text-white/90 text-sm mb-4">
                                    Get event planning tips weekly!
                                </p>
                                <div className="form-control">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email"
                                        className="input input-bordered input-sm mb-3 text-base-content"
                                    />
                                    <button className="btn btn-secondary btn-sm">
                                        Subscribe ✉️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetails;