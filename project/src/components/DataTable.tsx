import React from 'react';
import { Medicine } from '../types/medicine';

interface DataTableProps {
  data: Medicine | null;
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data) return null;

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200">
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                {formatKey(key)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;