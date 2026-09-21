import ResourceManager from '../../components/ResourceManager.jsx';

const jobFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'department', label: 'Department', required: false },
  { name: 'location', label: 'Location', required: false },
  { name: 'employment_type', label: 'Type', type: 'select', options: [
    { value: 'full_time', label: 'Full time' },
    { value: 'part_time', label: 'Part time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ] },
  { name: 'experience', label: 'Experience', required: false },
  { name: 'salary', label: 'Salary', required: false },
  { name: 'description', label: 'Description', type: 'textarea', rows: 8, required: true },
  { name: 'requirements', label: 'Requirements (JSON array)', type: 'json', rows: 4, required: false },
  { name: 'responsibilities', label: 'Responsibilities (JSON array)', type: 'json', rows: 4, required: false },
  { name: 'deadline', label: 'Deadline', type: 'date', required: false },
  { name: 'vacancies', label: 'Vacancies', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const CareerManagement = () => (
  <ResourceManager
    resourceKey="jobs"
    title="Career opportunities"
    itemLabel="job"
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'employment_type', label: 'Type' },
      { key: 'deadline', label: 'Deadline', type: 'date' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={jobFields}
  />
);

export default CareerManagement;
