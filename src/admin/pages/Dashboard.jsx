import { Link } from 'react-router';
import { AlertCircle, CalendarCheck, Image, Mail, Users, Video } from 'lucide-react';

import StatsCard from '../Components/StatsCard';
import Seo from '../../components/Seo';
import { ErrorState, LoadingScreen } from '../../components/ui/States';
import { useApiResource } from '../../hooks/useApiResource';
import { adminApi } from '../../services/admin.js';

/** Real dashboard: counts, pending submissions and the latest activity. */
const Dashboard = () => {
  const { data, loading, error, refetch } = useApiResource(() => adminApi.dashboard(), []);

  if (loading) return <LoadingScreen message="Loading dashboard…" />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const content = data?.content || {};
  const submissions = data?.submissions || {};
  const pending = submissions.pending || {};
  const recent = data?.recent || {};

  const cards = [
    { icon: '🎪', title: 'Services', count: content.services ?? 0, color: 'text-blue-600' },
    { icon: '🎤', title: 'Artists', count: content.artists ?? 0, color: 'text-green-600' },
    { icon: '🖼️', title: 'Gallery items', count: content.gallery ?? 0, color: 'text-purple-600' },
    { icon: '📝', title: 'Blog posts', count: content.blogs ?? 0, color: 'text-orange-600' },
    { icon: '👥', title: 'Team members', count: content.team ?? 0, color: 'text-pink-600' },
    { icon: '💬', title: 'Testimonials', count: content.testimonials ?? 0, color: 'text-teal-600' },
    { icon: '📅', title: 'Upcoming events', count: content.upcoming_events ?? 0, color: 'text-indigo-600' },
    { icon: '🎬', title: 'Videos', count: content.videos ?? 0, color: 'text-red-600' },
  ];

  const pendingCards = [
    { label: 'Contact messages', count: pending.contact_messages ?? 0, to: '/admin/dashboard/messages', icon: Mail },
    { label: 'Booking requests', count: pending.booking_requests ?? 0, to: '/admin/dashboard/bookings', icon: CalendarCheck },
    { label: 'Artist applications', count: pending.artist_applications ?? 0, to: '/admin/dashboard/applications', icon: Users },
    { label: 'Talent hunt', count: pending.talent_hunt ?? 0, to: '/admin/dashboard/talent-hunt', icon: Users },
    { label: 'Vendors', count: pending.vendors ?? 0, to: '/admin/dashboard/vendors', icon: Users },
    { label: 'Job applications', count: pending.job_applications ?? 0, to: '/admin/dashboard/careers/applications', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <Seo title="Admin Dashboard" noIndex />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Live numbers straight from the API — the previous build showed fixed placeholders here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
          Pending submissions ({submissions.total_pending ?? 0})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pendingCards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
            >
              <card.icon className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-gray-900">{card.count}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Latest messages</h3>
          {(recent.contact_messages || []).length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {recent.contact_messages.map((message) => (
                <li key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{message.full_name || 'Website visitor'}</p>
                    <p className="text-gray-600 text-sm">{message.subject || 'General enquiry'}</p>
                  </div>
                  <span className="badge badge-sm">{message.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Next events</h3>
          {(recent.events || []).length === 0 ? (
            <p className="text-sm text-gray-500">No events scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {recent.events.map((event) => (
                <li key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-gray-600 text-sm">{event.start_date}</p>
                  </div>
                  <span className="badge badge-sm badge-outline">{event.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin/dashboard/gallery" className="card bg-white border border-gray-100 p-4 hover:shadow-md">
          <Image className="w-5 h-5 text-primary mb-2" aria-hidden="true" /> Add gallery images
        </Link>
        <Link to="/admin/dashboard/videos" className="card bg-white border border-gray-100 p-4 hover:shadow-md">
          <Video className="w-5 h-5 text-primary mb-2" aria-hidden="true" /> Add a video
        </Link>
        <Link to="/admin/dashboard/blogs" className="card bg-white border border-gray-100 p-4 hover:shadow-md">
          Write a blog post
        </Link>
        <Link to="/admin/dashboard/settings" className="card bg-white border border-gray-100 p-4 hover:shadow-md">
          Site settings
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
