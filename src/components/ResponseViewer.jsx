/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Search,
  FileDown,
} from "lucide-react";
import toast from "react-hot-toast";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";

const getStatusColor = (status) => {
  if (!status) return "text-gray-500";
  if (status >= 200 && status < 300) return "text-green-600";
  if (status >= 400) return "text-red-600";
  return "text-yellow-600";
};

const highlightMatches = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
};

const ResponseViewer = ({ response, loading, time }) => {
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const viewerRef = useRef(null);

  const handleCopy = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      toast.success("Response body copied!");
    } else {
      toast.error("No response body to copy.");
    }
  };

  const handleExport = () => {
    const blob = new Blob([
      JSON.stringify(
        {
          status: response.status,
          headers: response.headers,
          data: response.data,
        },
        null,
        2
      ),
      { type: "application/json" },
    ]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "response.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [response, showBody, showHeaders]);

  if (!response && !loading) return null;

  const rawBody = response?.data ? JSON.stringify(response.data, null, 2) : "";
  const highlightedBody = highlightMatches(rawBody, searchQuery);

  return (
    <motion.div
      ref={viewerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white mt-6 p-6 rounded shadow border border-gray-200 relative font-inter"
    >
      {!loading && !response?.error && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded group"
            title="Copy response body"
          >
            <Copy className="h-4 w-4 text-gray-700 group-hover:text-blue-600" />
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded group"
            title="Export to JSON"
          >
            <FileDown className="h-4 w-4 text-gray-700 group-hover:text-blue-600" />
          </button>
        </div>
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
            )} font-inter`}
          >
            <CheckCircle className="w-5 h-5" />
            Status: {response.status}
            {time && (
              <span
                className={`text-xs ml-2 ${
                  time < 300
                    ? "text-green-600"
                    : time < 1000
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                ({time} ms)
              </span>
            )}
          </div>

          <div className="mb-4">
            <div
              onClick={() => setShowHeaders(!showHeaders)}
              className="flex items-center justify-between cursor-pointer font-semibold text-gray-700 hover:text-blue-600 mb-1 font-inter"
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
                  className="bg-gray-100 border border-gray-300 p-2 rounded overflow-x-auto text-sm font-inter"
                >
                  {JSON.stringify(response.headers, null, 2)}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div
                onClick={() => setShowBody(!showBody)}
                className="flex items-center justify-between cursor-pointer font-semibold text-gray-700 hover:text-blue-600 font-inter"
              >
                <span>Body</span>
                {showBody ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
                <Search className="h-4 w-4 text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search response..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-2 py-1 text-sm focus:outline-none"
                />
              </div>
            </div>
            <AnimatePresence initial={false}>
              {showBody && (
                <motion.pre
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="language-json bg-gray-100 border border-gray-300 p-2 rounded overflow-x-auto text-sm text-yellow-500 font-inter"
                >
                  <code
                    className="language-json"
                    dangerouslySetInnerHTML={{ __html: highlightedBody }}
                  ></code>
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
