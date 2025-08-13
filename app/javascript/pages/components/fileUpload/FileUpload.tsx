import { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
    setResult(null); // Clear previous results
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const headers: any = {};
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    try {
      const response = await fetch("/dashboard/file_upload", {
        method: "POST",
        headers: headers,
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
      setResult({ error: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Upload File</h3>
      
      <div className="space-y-4">
        <div>
          <input 
            type="file" 
            accept=".txt,.pdf" 
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={uploading}
          />
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-4 p-4 rounded-lg border">
            {result.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {result.error}
              </div>
            ) : (
              <div className="text-green-600">
                <strong>Success!</strong> {result.message}
                <div className="mt-2 text-sm text-gray-600">
                  <div><strong>Filename:</strong> {result.filename}</div>
                  <div><strong>Type:</strong> {result.content_type}</div>
                  {result.text && (
                    <div className="mt-2">
                      <strong>Extracted Text:</strong>
                      <div className="bg-gray-50 p-2 rounded mt-1 max-h-40 overflow-y-auto text-xs">
                        {result.text.substring(0, 500)}
                        {result.text.length > 500 && '...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;