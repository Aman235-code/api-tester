/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const getStatusColor = (status) => {
  if (!status) return "text-gray-500";
  if (status >= 200 && status < 300) return "text-green-600";
  if (status >= 400) return "text-red-600";
  return "text-yellow-600";
};

const ResponseViewer = ({ response, loading, time }) => {
  const [showHeaders, setShowHeaders] = useState(false);
  const [showBody, setShowBody] = useState(true);
  const bodyRef = useRef(null);
  const headersRef = useRef(null);

  const handleCopy = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      toast.success("Body copied to clipboard!");
    } else {
      toast.error("No body to copy.");
    }
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [response, showBody, showHeaders]);

  useEffect(() => {
    // Auto expand JSON body if it's large, otherwise collapse
    if (response?.data) {
      const jsonLength = JSON.stringify(response.data).length;
      setShowBody(jsonLength > 100);
    }
    setShowHeaders(false);
  }, [response]);

  if (!response && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white mt-6 p-6 rounded shadow border border-gray-200 relative font-inter"
    >
      {!loading && !response?.error && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded group"
          title="Copy response body"
        >
          <Copy className="h-4 w-4 text-gray-700 group-hover:text-blue-600" />
          <span className="sr-only">Copy body</span>
        </button>
      )}

      {loading ? (
        <div className="animate-pulse text-blue-600 font-semibold">
          Waiting for response...
        </div>
      ) : response?.error ? (
        <div className="text-red-600 font-semibold flex items-center gap-2">
          <XCircle className="w-5 h-5" /> Error: {response.error}
        </div>
      ) : (
        <>
          <div
            className={`mb-4 font-semibold flex gap-2 items-center ${getStatusColor(
              response.status
            )}`}
          >
            <CheckCircle className="w-5 h-5" />
            Status: {response.status}{" "}
            {time && <span className="text-xs text-gray-500">({time} ms)</span>}
          </div>

          {/* Collapsible Headers */}
          <div className="mb-4">
            <div
              onClick={() => setShowHeaders(!showHeaders)}
              className="flex items-center justify-between cursor-pointer font-semibold text-gray-700 hover:text-blue-600 mb-1"
            >
              <span>Headers</span>
              {showHeaders ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
            <AnimatePresence initial={false}>
              {showHeaders && (
                <motion.pre
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 border border-gray-300 p-2 rounded overflow-x-auto text-sm"
                >
                  {JSON.stringify(response.headers, null, 2)}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>

          {/* Collapsible Body */}
          <div>
            <div
              onClick={() => setShowBody(!showBody)}
              className="flex items-center justify-between cursor-pointer font-semibold text-gray-700 hover:text-blue-600 mb-1"
            >
              <span>Body</span>
              {showBody ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
            <AnimatePresence initial={false}>
              {showBody && (
                <motion.pre
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="language-json bg-gray-100 border border-gray-300 p-2 rounded overflow-x-auto text-sm"
                >
                  <code className="language-json">
                    {JSON.stringify(response.data, null, 2)}
                  </code>
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ResponseViewer;
