// App.jsx
import React, { useState } from "react";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import { Toaster } from "react-hot-toast";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [presets, setPresets] = useState(
    JSON.parse(localStorage.getItem("api_presets")) || []
  );

  const addPreset = (preset) => {
    const updated = [...presets, preset];
    setPresets(updated);
    localStorage.setItem("api_presets", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
        🧪 API Tester Pro
      </h1>
      <RequestForm
        setResponse={setResponse}
        setLoading={setLoading}
        setResponseTime={setResponseTime}
        presets={presets}
        addPreset={addPreset}
      />
      <ResponseViewer
        response={response}
        loading={loading}
        time={responseTime}
      />
    </div>
  );
}

export default App;
