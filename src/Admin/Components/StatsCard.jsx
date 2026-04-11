const StatsCard = ({ icon, title, count, color }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-gray-600 text-sm font-semibold'>{title}</p>
          <p className={`text-4xl font-bold ${color} mt-2`}>{count}</p>
        </div>
        <div className='text-4xl'>{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;