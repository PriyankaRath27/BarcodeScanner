import React, { useState } from 'react';
import { Download, Database, Scan } from 'lucide-react';
import BarcodeScanner from './components/BarcodeScanner';
import XLSUploader from './components/XLSUploader';
import DataTable from './components/DataTable';
import { Medicine } from './types/medicine';
import { readXLSFile, exportToXLS } from './utils/xlsUtils';

function App() {
  const [database, setDatabase] = useState<Medicine[]>([]);
  const [currentResult, setCurrentResult] = useState<Medicine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedResults, setScannedResults] = useState<Medicine[]>([]);
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState(false);

  const handleXLSUpload = async (file: File) => {
    try {
      const data = await readXLSFile(file);
      setDatabase(data);
      setIsDatabaseLoaded(true);
      setError(null);
    } catch (err) {
      setError('Error reading XLS file. Please ensure it\'s a valid Excel file.');
    }
  };

  const handleBarcodeScan = (barcodeValue: string) => {
    if (database.length === 0) {
      setError('Please upload XLS database first');
      return;
    }

    // Simulate matching barcode with random database entry
    const randomIndex = Math.floor(Math.random() * database.length);
    const result = database[randomIndex];
    
    setCurrentResult(result);
    setScannedResults(prev => [...prev, result]);
    setError(null);
  };

  const handleExport = () => {
    if (scannedResults.length === 0) {
      setError('No data to export');
      return;
    }
    exportToXLS(scannedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Medicine Barcode Scanner
          </h1>
          <p className="text-gray-600">
            Upload database, scan barcodes, and export results
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Database className="w-5 h-5" />
                <h2 className="font-semibold">Step 1: Load Database</h2>
              </div>
              <XLSUploader onUpload={handleXLSUpload} />
              {isDatabaseLoaded && (
                <p className="text-sm text-green-600">
                  ✓ Database loaded ({database.length} entries)
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Scan className="w-5 h-5" />
                <h2 className="font-semibold">Step 2: Scan Barcode</h2>
              </div>
              <BarcodeScanner 
                onScan={handleBarcodeScan}
                onError={setError}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {currentResult && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Latest Scan Result
              </h2>
              <DataTable data={currentResult} />
              {/* {currentResult.status === 'TRUE' && currentResult.expiryDate && (
      <p className="text-sm text-gray-700">
        Expiry Date: {currentResult.expiryDate}
      </p>
              )} */}
            </div>
          )}

          {scannedResults.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors w-full md:w-auto"
              >
                <Download className="w-5 h-5" />
                Export {scannedResults.length} Results to XLS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;