import SubmissionManager from '../../../components/SubmissionManager.jsx';

const AdminTalentHunt = () => (
  <SubmissionManager
    resourceKey="talentHunt"
    endpoint={adminApi.talentHunt}
    title="Talent hunt registrations"
    columns={[
      { key: 'full_name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'city', label: 'City' },
      { key: 'age', label: 'Age' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Received' },
    ]}
  />
);

export default AdminTalentHunt;
