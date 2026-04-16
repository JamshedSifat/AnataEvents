import React, { useState, useEffect } from 'react';
import { Search, Calendar, User } from 'lucide-react';
import BlogCardItem from './BlogCardItem';

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

      const savedBlogs = localStorage.getItem('blogs');
      if (savedBlogs) {
        const data = JSON.parse(savedBlogs);
        setBlogs(data);
        setFilteredBlogs(data);
        setLoading(false);
        return;
      }

      const sampleBlogs = [
        {
          _id: '1',
          title: 'How to Plan the Perfect Wedding',
          category: 'Wedding',
          image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=500&fit=crop',
          excerpt: 'Learn the essential tips for planning your dream wedding event.',
          content: `Planning a wedding can be overwhelming, but with the right approach and timeline, you can create an unforgettable celebration.

Step 1: Set Your Budget and Timeline
The first step in planning a wedding is determining how much you want to spend and when you want to get married. This will help you make decisions about venue, catering, and other details.

Step 2: Choose Your Venue
Your venue sets the tone for your entire wedding. Whether you choose a church, garden, or ballroom, make sure it reflects your style and can accommodate your guest list.

Step 3: Create Your Guest List
Determine who you want to invite and send invitations at least 6-8 weeks in advance. Keep track of RSVPs to finalize your numbers for catering.

Step 4: Hire Your Vendors
Book your photographer, videographer, caterer, florist, and music/DJ well in advance. These professionals are crucial to making your day special.

Step 5: Plan Your Décor
Choose a color scheme and theme that reflects your personality. Flowers, lighting, and table settings can transform any space.

Step 6: Final Details
Pay attention to small details like place cards, favors, and a timeline for the day. These elements make your wedding memorable.

Remember, your wedding day is about celebrating your love with the people who matter most. Enjoy the planning process!`,
          author: 'Event Manager',
          date: '2024-04-10',
          featured: true
        },
        {
          _id: '2',
          title: 'Corporate Event Management Best Practices',
          category: 'Corporate',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
          excerpt: 'Discover professional strategies for managing successful corporate events.',
          content: `Corporate events are crucial for team building and client relations. This comprehensive guide covers everything from pre-event planning to post-event follow-up.

Understanding Your Objectives
Before planning any corporate event, understand what you want to achieve. Are you launching a new product? Building team morale? Networking with clients? Your objectives will guide all your decisions.

Choosing the Right Venue
The venue should reflect your company's brand and be accessible to all attendees. Consider parking, public transportation, and accessibility for people with disabilities.

Managing Logistics
Create a detailed timeline and assign responsibilities. From setup to breakdown, every aspect should be planned and communicated clearly to your team.

Engaging Your Audience
Make your event interactive with activities, discussions, and networking opportunities. Use technology to enhance engagement.

Post-Event Follow-up
Send thank you emails, collect feedback, and follow up with attendees. This helps build relationships and improve future events.`,
          author: 'Event Specialist',
          date: '2024-04-08',
          featured: true
        },
        {
          _id: '3',
          title: 'Birthday Party Ideas and Themes',
          category: 'Birthday',
          image: 'https://images.unsplash.com/photo-1540575467063-178f50902556?w=800&h=500&fit=crop',
          excerpt: 'Creative birthday party themes and decoration ideas for all ages.',
          content: `Whether you are planning a kids birthday party or an adult celebration, we have amazing themes and decoration ideas to make it special.

Popular Themes for Kids:
- Superhero Adventure
- Princess Castle
- Pirate Treasure Hunt
- Space Explorer
- Jungle Safari

Popular Themes for Adults:
- Retro Party (80s/90s)
- Tropical Paradise
- Masquerade Ball
- Garden Party
- Decade Party

Decoration Tips:
Use balloons, streamers, and themed centerpieces to transform your space. Lighting can create ambiance. Food presentation should match your theme.

Entertainment Ideas:
Consider hiring entertainment appropriate to the theme. Games, photo booths, and music playlists can keep guests engaged throughout the party.`,
          author: 'Creative Director',
          date: '2024-04-05',
          featured: false
        },
        {
          _id: '4',
          title: 'Conference Planning Guide',
          category: 'Conference',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
          excerpt: 'Everything you need to know about organizing a successful conference.',
          content: `Conferences bring together professionals to share knowledge and network. This guide covers all aspects of conference planning.

Pre-Conference Planning:
- Define conference objectives
- Choose date and venue
- Secure keynote speakers
- Create marketing strategy
- Set up registration system

During the Conference:
- Ensure smooth registration process
- Manage speaker schedules
- Facilitate networking opportunities
- Handle technical requirements
- Monitor attendee satisfaction

Post-Conference Activities:
- Share photos and videos
- Send thank you emails
- Collect feedback surveys
- Publish conference proceedings
- Plan for next year's event`,
          author: 'Conference Expert',
          date: '2024-04-01',
          featured: false
        },
        {
          _id: '5',
          title: 'Product Launch Event Essentials',
          category: 'Corporate',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop',
          excerpt: 'Key elements to make your product launch event memorable and successful.',
          content: `A product launch event is your chance to create buzz and excitement around your new product. Here's how to do it right.

Pre-Launch Strategy:
- Create anticipation through marketing
- Invite key media and influencers
- Prepare product demonstrations
- Train your team thoroughly
- Have contingency plans

Event Execution:
- Start with compelling presentation
- Allow hands-on product experience
- Offer media interviews
- Provide press kits
- Have social media live coverage

Follow-up Strategy:
- Share event highlights on social media
- Send thank you messages
- Track media coverage
- Gather attendee feedback
- Use insights for future launches`,
          author: 'Marketing Manager',
          date: '2024-03-28',
          featured: false
        }
      ];
      
      setBlogs(sampleBlogs);
      setFilteredBlogs(sampleBlogs);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest event management tips, trends, and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Featured Blogs */}
            {filteredBlogs.filter(blog => blog.featured).length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Featured</h2>
                <div className="space-y-6">
                  {filteredBlogs.filter(blog => blog.featured).map(blog => (
                    <BlogCardItem key={blog._id} blog={blog} featured={true} />
                  ))}
                </div>
              </div>
            )}

            {/* All Blogs */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {selectedCategory !== 'All' ? selectedCategory + ' Articles' : 'Latest Articles'}
              </h2>
              
              {filteredBlogs.length > 0 ? (
                <div className="space-y-6">
                  {filteredBlogs.map(blog => (
                    <BlogCardItem key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-lg text-gray-600">
                    No blogs found. Try a different search or category.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded transition ${
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Recent Posts</h3>
              <div className="space-y-4">
                {blogs.slice(0, 5).map(blog => (
                  <a
                    key={blog._id}
                    href={`/blog/${blog._id}`}
                    className="block group"
                  >
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition line-clamp-2 text-sm">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.date).toLocaleDateString()}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Archive */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Archive</h3>
              <div className="space-y-2">
                {['April 2024', 'March 2024', 'February 2024', 'January 2024'].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="block text-sm text-primary hover:underline"
                  >
                    {month}
                  </a>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Latest News</h3>
              <p className="text-sm mb-4">
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