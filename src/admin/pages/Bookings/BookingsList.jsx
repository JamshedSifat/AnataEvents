import SubmissionManager from '../../components/SubmissionManager.jsx';
import { adminApi } from '../../../services/admin.js';

const BookingsList = () => (
  <SubmissionManager
    resourceKey="bookings"
    endpoint={adminApi.bookings}
    title="Artist booking requests"
    description="Booking enquiries submitted from the artist pages."
    columns={[
      { key: 'full_name', label: 'Name' },
      { key: 'artist_name', label: 'Artist' },
      { key: 'event_type', label: 'Event' },
      { key: 'event_date', label: 'Date' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Received' },
    ]}
  />
);

export default BookingsList;
