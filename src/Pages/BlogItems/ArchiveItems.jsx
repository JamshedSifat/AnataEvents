import React from 'react';

const ArchiveItems = () => {
    return (
        <div>
             {/* Archive */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Archive</h3>
              <div className="space-y-2">
                {['April 2024', 'March 2024', 'February 2024', 'January 2024'].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="block text-xs sm:text-sm text-primary hover:underline"
                  >
                    {month}
                  </a>
                ))}
              </div>
            </div>
        </div>
    );
};

export default ArchiveItems;