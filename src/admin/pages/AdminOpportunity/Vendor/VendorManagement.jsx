import SubmissionManager from '../../../components/SubmissionManager.jsx';

const VendorManagement = () => (
  <SubmissionManager
    resourceKey="vendors"
    endpoint={adminApi.vendors}
    title="Vendor registrations"
    description="Approve a vendor to mark them as a trusted partner."
    columns={[
      { key: 'company_name', label: 'Company' },
      { key: 'contact_person', label: 'Contact' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'vendor_category', label: 'Category' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Received' },
    ]}
  />
);

export default VendorManagement;
