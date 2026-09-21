import ResourceManager from '../../components/ResourceManager.jsx';

const teamFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'role', label: 'Role', required: true },
  { name: 'description', label: 'Bio', type: 'textarea', required: false },
  { name: 'email', label: 'Email', type: 'email', required: false },
  { name: 'phone', label: 'Phone (BD format)', required: false },
  { name: 'linkedin', label: 'LinkedIn', required: false },
  { name: 'facebook', label: 'Facebook', required: false },
  { name: 'instagram', label: 'Instagram', required: false },
  { name: 'twitter', label: 'Twitter/X', required: false },
  { name: 'image', label: 'Photo upload', type: 'file', required: false },
  { name: 'image_url', label: '…or photo URL', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const TeamManagement = () => (
  <ResourceManager
    resourceKey="team"
    title="Team members"
    itemLabel="team member"
    columns={[
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={teamFields}
  />
);

export default TeamManagement;
