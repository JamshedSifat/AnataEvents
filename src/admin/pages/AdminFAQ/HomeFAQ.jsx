import ResourceManager from '../../components/ResourceManager.jsx';

const faqFields = [
  { name: 'question', label: 'Question', required: true },
  { name: 'answer', label: 'Answer', type: 'textarea', rows: 5, required: true },
  { name: 'section', label: 'Section', type: 'select', options: [
    { value: 'home', label: 'Home' },
    { value: 'corporate', label: 'Corporate events' },
    { value: 'virtual', label: 'Virtual events' },
    { value: 'services', label: 'Services' },
  ] },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const HomeFAQ = () => (
  <ResourceManager
    resourceKey="faqs"
    title="FAQs"
    itemLabel="question"
    description="Section controls where each question appears."
    columns={[
      { key: 'question', label: 'Question' },
      { key: 'section', label: 'Section' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={faqFields}
    filters={[{ name: 'section', label: 'All sections', options: [
      { value: 'home', label: 'Home' },
      { value: 'corporate', label: 'Corporate' },
      { value: 'virtual', label: 'Virtual' },
      { value: 'services', label: 'Services' },
    ] }]}
  />
);

export default HomeFAQ;
