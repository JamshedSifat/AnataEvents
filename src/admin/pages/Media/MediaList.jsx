import SubmissionManager from '../../components/SubmissionManager.jsx';

const MediaList = () => (
  <SubmissionManager
    resourceKey="messages"
    endpoint={adminApi.messages}
    title="Contact messages"
    description="Every enquiry submitted through the website contact form."
    showApprove={false}
    showReadToggle
    columns={[
      { key: 'full_name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'subject', label: 'Subject' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Received' },
    ]}
  />
);

export default MediaList;
