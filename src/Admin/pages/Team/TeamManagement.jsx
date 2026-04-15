import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import TeamTable from './TeamTable';
import TeamForm from './TeamForm';

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = () => {
    try {
      const savedTeamMembers = localStorage.getItem('teamMembers');
      if (savedTeamMembers) {
        setTeamMembers(JSON.parse(savedTeamMembers));
        console.log('Team members loaded from localStorage');
      } else {
        const sampleTeamMembers = [
          {
            _id: '1',
            name: 'John Doe',
            role: 'Event Manager',
            image: 'https://via.placeholder.com/300x300?text=John+Doe',
            description: 'Experienced event manager with 10+ years of expertise',
            email: 'john@example.com',
            phone: '+1-234-567-8900',
            social: {
              twitter: 'https://twitter.com',
              linkedin: 'https://linkedin.com',
              facebook: 'https://facebook.com'
            }
          }
        ];
        setTeamMembers(sampleTeamMembers);
        localStorage.setItem('teamMembers', JSON.stringify(sampleTeamMembers));
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    }
  };

  const saveTeamMembersToStorage = (updatedMembers) => {
    try {
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      console.log('Team members saved to localStorage');
    } catch (error) {
      console.error('Error saving team members:', error);
      toast.error('Failed to save team members');
    }
  };

  const handleCreateMember = async (memberData) => {
    try {
      setLoading(true);
      
      const newMember = {
        ...memberData,
        _id: Date.now().toString()
      };

      const updatedMembers = [...teamMembers, newMember];
      setTeamMembers(updatedMembers);
      saveTeamMembersToStorage(updatedMembers);
      
      toast.success('Team member added successfully!');
      setIsModalOpen(false);
      
      console.log('Team member created:', newMember);
    } catch (error) {
      console.error('Error creating team member:', error);
      toast.error('Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (id, memberData) => {
    try {
      setLoading(true);
      
      const updatedMembers = teamMembers.map(member =>
        member._id === id ? { ...memberData, _id: id } : member
      );
      
      setTeamMembers(updatedMembers);
      saveTeamMembersToStorage(updatedMembers);
      
      toast.success('Team member updated successfully!');
      setSelectedMember(null);
      
      console.log('Team member updated:', id);
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        setLoading(true);
        
        const updatedMembers = teamMembers.filter(member => member._id !== id);
        setTeamMembers(updatedMembers);
        saveTeamMembersToStorage(updatedMembers);
        
        toast.success('Team member deleted successfully!');
        
        console.log('Team member deleted:', id);
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Failed to delete team member');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Team Management</h1>
          <p className="text-base-content/60 mt-2">Total Members: {teamMembers.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          <span>+</span>
          Add Team Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Team Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Team Member</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TeamForm
                onSubmit={handleCreateMember}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Team Member</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TeamForm
                member={selectedMember}
                onSubmit={(data) =>
                  handleUpdateMember(selectedMember._id, data)
                }
                onCancel={() => setSelectedMember(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Team Members Table */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        {loading ? (
          <div className="card-body flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredMembers.length > 0 ? (
          <TeamTable
            members={filteredMembers}
            onEdit={setSelectedMember}
            onDelete={handleDeleteMember}
          />
        ) : (
          <div className="card-body text-center py-12">
            <p className="text-base-content/60 text-lg">No team members found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary mt-4"
            >
              Add First Team Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}