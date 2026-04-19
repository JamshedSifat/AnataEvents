// File: src/Admin/Pages/FAQ/AdminFAQ.jsx (Unified with Tabs)
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, X } from 'lucide-react';

const HomeFAQ = () => {
  const [activeTab, setActiveTab] = useState('corporate'); // 'corporate' or 'home'
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    _id: '',
    question: '',
    answer: ''
  });

  const defaultCorporateFAQs = [
    {
      _id: 'corp-faq-1',
      question: "What services does Ananta Events & Entertainment provide?",
      answer: "Ananta Events & Entertainment offers a wide range of event management services, including corporate events, brand activations, weddings, social events, product launches, conferences, exhibitions, concerts, fairs, and cultural programs. We provide both creative planning and flawless execution to make every event a success."
    },
    {
      _id: 'corp-faq-2',
      question: "Why choose Ananta as your event management partner in Bangladesh?",
      answer: "Choosing Ananta means choosing professionalism, creativity, and reliability. Our team pays attention to every detail, ensures timely delivery, and provides customized solutions tailored to your event needs. We focus on client satisfaction and have a proven track record of managing both local and international events with excellence."
    },
    {
      _id: 'corp-faq-3',
      question: "Do you provide exhibition stand fabrication services?",
      answer: "Yes, we provide exhibition stand fabrication and design services. From concept to execution, our team creates visually appealing and functional stands that highlight your brand and engage visitors effectively."
    },
    {
      _id: 'corp-faq-4',
      question: "Can Ananta handle both small and large-scale events?",
      answer: "Absolutely. Whether it's a small private gathering, a corporate meeting, or a large-scale concert or exhibition, Ananta has the expertise, resources, and team strength to manage events of any size."
    },
    {
      _id: 'corp-faq-5',
      question: "Do you organize conferences and seminars?",
      answer: "Yes, Ananta specializes in organizing professional conferences, seminars, and workshops. We take care of venue management, audio-visual setup, logistics, registration, and overall coordination so you can focus on your content and guests."
    },
    {
      _id: 'corp-faq-6',
      question: "What makes Ananta different from other event planners in Bangladesh?",
      answer: "What sets Ananta apart is our commitment to creativity, precision, and client satisfaction. We don't just plan events-we craft experiences. Our dedicated team ensures innovative ideas, flawless execution, and personalized service, making every event truly memorable."
    },
    {
      _id: 'corp-faq-7',
      question: "Can you provide end-to-end solutions for brand activations?",
      answer: "Yes. We provide complete end-to-end solutions for brand activations, including concept development, creative design, promotional strategies, logistics, on-ground execution, and post-event reporting. Our goal is to maximize your brand's visibility and audience engagement."
    },
    {
      _id: 'corp-faq-8',
      question: "Where does Ananta provide event services in Bangladesh?",
      answer: "Ananta provides event management services all across Bangladesh, including major cities like Dhaka, Chattogram, Khulna, Sylhet, Rajshahi, Barishal, Bogura, and more. We have the flexibility and capacity to manage events nationwide."
    },
    {
      _id: 'corp-faq-9',
      question: "How can I request a quotation for my event?",
      answer: "Requesting a quotation is simple. You can contact us through our official website, social media channels, or directly via phone/email. Share your event details with us, and our team will provide you with a customized quotation tailored to your specific requirements."
    }
  ];

  const defaultHomeFAQs = [
    {
      _id: 'home-faq-1',
      question: "What is Ananta Events & Entertainment?",
      answer: "Ananta Events & Entertainment is a leading event management company in Bangladesh specializing in creating memorable experiences for corporate, social, and cultural events."
    },
    {
      _id: 'home-faq-2',
      question: "How long has Ananta been in the industry?",
      answer: "Ananta Events & Entertainment has been serving clients since 2009, with over a decade of experience in event management and execution."
    },
    {
      _id: 'home-faq-3',
      question: "What types of events do you organize?",
      answer: "We organize corporate events, weddings, conferences, exhibitions, concerts, brand activations, product launches, and cultural programs."
    }
  ];

  useEffect(() => {
    loadFAQs();
  }, [activeTab]);

  const loadFAQs = () => {
    try {
      setLoading(true);
      const storageKey = activeTab === 'corporate' ? 'corporateFAQs' : 'homeFAQs';
      const defaultFAQs = activeTab === 'corporate' ? defaultCorporateFAQs : defaultHomeFAQs;
      
      let data = [];
      const savedFAQs = localStorage.getItem(storageKey);
      
      if (savedFAQs) {
        data = JSON.parse(savedFAQs);
      } else {
        data = defaultFAQs;
        localStorage.setItem(storageKey, JSON.stringify(data));
      }

      setFaqs(data);
      setFilteredFaqs(data);
      setSearchTerm('');
      setLoading(false);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = faqs;

    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  }, [searchTerm, faqs]);

  const generateUniqueId = () => {
    const prefix = activeTab === 'corporate' ? 'corp' : 'home';
    return `${prefix}-faq-${Date.now()}`;
  };

  const handleViewDetails = (faq) => {
    setSelectedFaq(faq);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingFaq(null);
    setFormData({
      _id: generateUniqueId(),
      question: '',
      answer: ''
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData(faq);
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveFaq = () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Both question and answer are required');
      return;
    }

    const storageKey = activeTab === 'corporate' ? 'corporateFAQs' : 'homeFAQs';
    let updatedFaqs;

    if (editingFaq) {
      updatedFaqs = faqs.map(f => f._id === editingFaq._id ? formData : f);
      alert('FAQ updated successfully!');
    } else {
      updatedFaqs = [...faqs, formData];
      alert('FAQ added successfully!');
    }

    localStorage.setItem(storageKey, JSON.stringify(updatedFaqs));
    setFaqs(updatedFaqs);
    setIsFormModalOpen(false);
    setFormData({
      _id: generateUniqueId(),
      question: '',
      answer: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const storageKey = activeTab === 'corporate' ? 'corporateFAQs' : 'homeFAQs';
      const updatedFaqs = faqs.filter(f => f._id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updatedFaqs));
      setFaqs(updatedFaqs);
      alert('FAQ deleted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <button
            onClick={handleAddNew}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New FAQ
          </button>
        </div>
        <p className="text-gray-600">Manage frequently asked questions</p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-8 bg-white rounded-lg p-4">
        <button
          onClick={() => setActiveTab('corporate')}
          className={`tab ${activeTab === 'corporate' ? 'tab-active' : ''}`}
        >
          Corporate FAQs ({defaultCorporateFAQs.length})
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`tab ${activeTab === 'home' ? 'tab-active' : ''}`}
        >
          Home FAQs ({defaultHomeFAQs.length})
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total FAQs</h3>
          <p className="text-3xl font-bold text-primary">{faqs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Showing</h3>
          <p className="text-3xl font-bold text-green-600">{filteredFaqs.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={faq._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 line-clamp-2">{faq.answer}</p>
                </div>
                <span className="badge badge-outline ml-4">{index + 1}</span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewDetails(faq)}
                  className="btn btn-sm btn-ghost gap-1"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEdit(faq)}
                  className="btn btn-sm btn-ghost gap-1"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="btn btn-sm btn-ghost text-error gap-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No FAQs found</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isDetailModalOpen && selectedFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">FAQ Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-semibold">Question</label>
                <p className="text-gray-900 mt-2 font-semibold">{selectedFaq.question}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-semibold">Answer</label>
                <p className="text-gray-900 mt-2 leading-relaxed whitespace-pre-wrap">{selectedFaq.answer}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedFaq);
                  }}
                  className="btn btn-primary flex-1"
                >
                  Edit FAQ
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="btn btn-ghost flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'} ({activeTab === 'corporate' ? 'Corporate' : 'Home'})
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Question *</label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleFormChange}
                  placeholder="Enter FAQ question"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Answer *</label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleFormChange}
                  placeholder="Enter FAQ answer"
                  className="textarea textarea-bordered w-full"
                  rows="8"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.answer.length} characters
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t">
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFaq}
                  className="btn btn-primary"
                >
                  {editingFaq ? 'Update' : 'Add'} FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeFAQ;