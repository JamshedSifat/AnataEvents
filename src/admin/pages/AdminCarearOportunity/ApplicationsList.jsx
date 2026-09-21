import SubmissionManager from '../../components/SubmissionManager.jsx';

const ApplicationsList = () => (
  <SubmissionManager
    resourceKey="jobApplications"
    endpoint={adminApi.jobApplications}
    title="Job applications"
    description="CVs submitted through the careers page."
    columns={[
      { key: 'full_name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'position', label: 'Position' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Received' },
    ]}
  />
);

export default ApplicationsList;
