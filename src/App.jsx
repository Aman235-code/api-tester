/* eslint-disable no-unused-vars */
// App.jsx
import React, { useState } from "react";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <Toaster position="top-center" />
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-center text-blue-700"
      >
        🧪 API Tester
      </motion.h1>
      <RequestForm setResponse={setResponse} setLoading={setLoading} />
      <ResponseViewer response={response} loading={loading} />
    </div>
  );
}

export default App;
