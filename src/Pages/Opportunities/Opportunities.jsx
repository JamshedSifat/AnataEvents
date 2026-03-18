import React from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, Users, Music, Zap } from 'lucide-react';

export default function Opportunities() {
  const navigate = useNavigate();

  const opportunities = [
    {
      id: 1,
      icon: Briefcase,
      title: 'Vendor Registration',
      description: 'Register your business and collaborate with us for events',
      path: '/opportunities/vendor-registration',
      color: 'bg-blue-50',
      borderColor: 'border-blue-200',
      btnColor: 'btn-primary'
    },
    {
      id: 2,
      icon: Zap,
      title: 'Talent Hunt',
      description: 'Showcase your talent and get discovered by event organizers',
      path: '/opportunities/talent-hunt',
      color: 'bg-purple-50',
      borderColor: 'border-purple-200',
      btnColor: 'btn-secondary'
    },
    {
      id: 3,
      icon: Music,
      title: 'Artist Registration',
      description: 'Register as an artist and get booking opportunities',
      path: '/opportunities/artist-registration',
      color: 'bg-pink-50',
      borderColor: 'border-pink-200',
      btnColor: 'btn-accent'
    },
    {
      id: 4,
      icon: Users,
      title: 'Career Opportunities',
      description: 'Join our team and build your career in event management',
      path: '/opportunities/careers',
      color: 'bg-green-50',
      borderColor: 'border-green-200',
      btnColor: 'btn-success'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join AnataEvents and be part of Bangladesh's premier event management platform
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {opportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <div
                key={opp.id}
                className={`${opp.color} ${opp.borderColor} border-2 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                  {opp.title}
                </h3>
                <p className="text-gray-600 text-center text-sm mb-6">
                  {opp.description}
                </p>
                <button
                  onClick={() => navigate(opp.path)}
                  className={`w-full btn ${opp.btnColor} btn-sm text-white font-semibold`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>

        {/* Why Join Us Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why Join AnataEvents?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">✓</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Opportunities</h3>
              <p className="text-gray-600">
                Connect with leading events across Bangladesh
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">✓</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Network</h3>
              <p className="text-gray-600">
                Build relationships with industry professionals
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">✓</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Growth & Exposure</h3>
              <p className="text-gray-600">
                Grow your career and gain visibility in the industry
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold mb-2">500+</h4>
              <p className="text-blue-100">Registered Vendors</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">1000+</h4>
              <p className="text-blue-100">Talented Artists</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">50+</h4>
              <p className="text-blue-100">Active Team Members</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">2000+</h4>
              <p className="text-blue-100">Successful Events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}