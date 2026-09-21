import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import TestimonialTable from './TestimonialTable';
import TestimonialForm from './TestimonialForm';

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = () => {
    try {
      const savedTestimonials = localStorage.getItem('testimonials');
      if (savedTestimonials) {
        setTestimonials(JSON.parse(savedTestimonials));
        console.log('Testimonials loaded from localStorage');
      } else {
        const sampleTestimonials = [
          {
            _id: '1',
            name: 'John Doe',
            designation: 'CEO',
            company: 'Tech Solutions',
            image: 'https://via.placeholder.com/100?text=John',
            rating: 5,
            review: 'Amazing event management! They handled everything perfectly.',
            eventType: 'Corporate Event'
          }
        ];
        setTestimonials(sampleTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(sampleTestimonials));
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Failed to load testimonials');
    }
  };

  const saveTestimonialsToStorage = (updatedTestimonials) => {
    try {
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
      console.log('Testimonials saved to localStorage');
    } catch (error) {
      console.error('Error saving testimonials:', error);
      toast.error('Failed to save testimonials');
    }
  };

  const handleCreateTestimonial = async (testimonialData) => {
    try {
      setLoading(true);
      
      const newTestimonial = {
        ...testimonialData,
        _id: Date.now().toString()
      };

      const updatedTestimonials = [...testimonials, newTestimonial];
      setTestimonials(updatedTestimonials);
      saveTestimonialsToStorage(updatedTestimonials);
      
      toast.success('Testimonial added successfully!');
      setIsModalOpen(false);
      
      console.log('Testimonial created:', newTestimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast.error('Failed to add testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTestimonial = async (id, testimonialData) => {
    try {
      setLoading(true);
      
      const updatedTestimonials = testimonials.map(testimonial =>
        testimonial._id === id ? { ...testimonialData, _id: id } : testimonial
      );
      
      setTestimonials(updatedTestimonials);
      saveTestimonialsToStorage(updatedTestimonials);
      
      toast.success('Testimonial updated successfully!');
      setSelectedTestimonial(null);
      
      console.log('Testimonial updated:', id);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        setLoading(true);
        
        const updatedTestimonials = testimonials.filter(testimonial => testimonial._id !== id);
        setTestimonials(updatedTestimonials);
        saveTestimonialsToStorage(updatedTestimonials);
        
        toast.success('Testimonial deleted successfully!');
        
        console.log('Testimonial deleted:', id);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Testimonial Management</h1>
          <p className="text-base-content/60 mt-2">Total Testimonials: {testimonials.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedTestimonial(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add New Testimonial
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Testimonial Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Testimonial</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TestimonialForm
                onSubmit={handleCreateTestimonial}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Testimonial</h2>
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TestimonialForm
                testimonial={selectedTestimonial}
                onSubmit={(data) =>
                  handleUpdateTestimonial(selectedTestimonial._id, data)
                }
                onCancel={() => setSelectedTestimonial(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredTestimonials.length > 0 ? (
          <TestimonialTable
            testimonials={filteredTestimonials}
            onEdit={setSelectedTestimonial}
            onDelete={handleDeleteTestimonial}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No testimonials found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Testimonial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}