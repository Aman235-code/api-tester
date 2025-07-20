import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, Loader2 } from "lucide-react";

const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return "text-green-600";
  if (status >= 400) return "text-red-600";
  return "text-yellow-600";
};

const ResponseViewer = ({ response, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex justify-center items-center p-8 bg-white rounded-lg shadow border"
      >
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-blue-600 font-medium">Loading response...</span>
      </motion.div>
    );
  }

  // If there's no response and we're not loading
  if (!response) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white mt-6 p-6 rounded-lg shadow-xl border border-gray-200"
    >
      {response?.error ? (
        <div className="text-red-600 font-semibold flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          Error: {response.error}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2">
            <strong>Status:</strong>
            <span className={`font-mono ${getStatusColor(response?.status)}`}>
              {response?.status}
            </span>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>

          <div className="mb-3">
            <strong className="flex items-center gap-1 text-blue-600">
              <Info className="h-4 w-4" /> Headers:
            </strong>
            <pre className="bg-gray-50 text-sm p-3 rounded-md mt-1 overflow-x-auto border border-gray-200">
              {JSON.stringify(response?.headers, null, 2)}
            </pre>
          </div>

          <div>
            <strong className="flex items-center gap-1 text-blue-600">
              <Info className="h-4 w-4" /> Body:
            </strong>
            <pre className="bg-gray-50 text-sm p-3 rounded-md mt-1 overflow-x-auto border border-gray-200">
              {JSON.stringify(response?.data, null, 2)}
            </pre>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ResponseViewer;
