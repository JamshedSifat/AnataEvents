import ResourceManager from '../../components/ResourceManager.jsx';

const userFields = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'full_name', label: 'Full name', required: false },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'viewer', label: 'Viewer (read-only)' },
      { value: 'editor', label: 'Editor (can publish)' },
      { value: 'super_admin', label: 'Super admin (full control)' },
    ],
  },
  { name: 'phone', label: 'Phone (BD format)', required: false },
  { name: 'password', label: 'Password (leave blank to keep)', type: 'password', required: false,
    help: 'Minimum 12 characters. New users must have a password.' },
  { name: 'is_active', label: 'Active', type: 'checkbox', default: true },
];

/**
 * Staff management. The API refuses to delete or deactivate the last active
 * super admin, and refuses to let anyone deactivate or demote themselves —
 * those rules live on the server, not here.
 */
const UsersList = () => (
  <ResourceManager
    resourceKey="users"
    title="Users"
    itemLabel="user"
    description="Viewer = read-only dashboard access, editor = can publish content, super admin = everything."
    columns={[
      { key: 'email', label: 'Email' },
      { key: 'full_name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
      { key: 'last_login', label: 'Last login' },
    ]}
    fields={userFields}
    canReorder={false}
    searchPlaceholder="Search users…"
  />
);

export default UsersList;
