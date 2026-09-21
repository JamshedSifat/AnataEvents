import React, { useEffect, useState } from 'react';
import { Mail, Phone, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { contentApi } from '../../../services/content';

const MyTeam = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const data = await contentApi.team();
        setData(
          data.map((member) => ({
            _id: member.id,
            name: member.name,
            role: member.role,
            description: member.description,
            image: member.image_src || '',
            email: member.email,
            phone: member.phone,
            social: {
              linkedin: member.linkedin,
              facebook: member.facebook,
              instagram: member.instagram,
              twitter: member.twitter,
            },
          }))
        );
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <section  className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-error text-lg">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
            OUR TEAM
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Meet Our <span className="text-primary">Expert Team</span>
          </h2>
          <p className="text-neutral max-w-2xl mx-auto">
            Passionate professionals dedicated to making your brand succeed through strategic event management
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {data.map((member, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
              className="group text-center"
            >
              {/* Image Container */}
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Social Links on Hover */}
                {hoveredMember === index && member.social && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-circle bg-white text-primary hover:bg-primary hover:text-white">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-circle bg-white text-primary hover:bg-primary hover:text-white">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.facebook && (
                      <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-circle bg-white text-primary hover:bg-primary hover:text-white">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-circle bg-white text-primary hover:bg-primary hover:text-white">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-secondary mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold text-sm md:text-base mb-2">
                  {member.role}
                </p>
                <p className="text-neutral text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {member.description || "Expert professional"}
                </p>

                {/* Contact Info on Hover */}
                {hoveredMember === index && (
                  <div className="mt-3 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-primary">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-primary">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${member.phone}`}>{member.phone}</a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom accent line */}
              <div className="mt-4 h-1 w-12 bg-primary mx-auto rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral text-lg">No team members found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTeam;