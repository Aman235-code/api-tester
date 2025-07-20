/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  SendHorizonal,
  Loader2,
  ArrowRightLeft,
  Upload,
  FilePen,
  Trash2,
  Save,
  Trash,
  FilePlus,
  FolderOpen,
} from "lucide-react";
import { Listbox } from "@headlessui/react";

const methodOptions = [
  { name: "GET", icon: <ArrowRightLeft className="text-green-600 h-4 w-4" /> },
  { name: "POST", icon: <Upload className="text-yellow-600 h-4 w-4" /> },
  { name: "PUT", icon: <FilePen className="text-blue-600 h-4 w-4" /> },
  { name: "DELETE", icon: <Trash2 className="text-red-600 h-4 w-4" /> },
];

const templates = [
  {
    name: "Get Posts",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
    body: "",
  },
  {
    name: "Create Post",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    body: '{"title": "foo", "body": "bar", "userId": 1}',
  },
];

const RequestForm = ({
  setResponse,
  setLoading,
  setResponseTime,
  presets = [],
  addPreset,
}) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);

  const sendRequest = async () => {
    setIsSending(true);
    setLoading(true);
    toast.loading("Sending request...");

    try {
      const config = {
        method,
        url,
        data: method !== "GET" ? JSON.parse(body || "{}") : undefined,
      };
      const startTime = performance.now();
      const res = await axios(config);
      const endTime = performance.now();

      const timeTaken = (endTime - startTime).toFixed(2);

      setResponse({
        status: res.status,
        headers: res.headers,
        data: res.data,
        time: timeTaken,
      });

      setResponseTime(timeTaken);
      toast.dismiss();
      toast.success(`Success! Status ${res.status}`);
    } catch (err) {
      setResponse({
        error: err.message,
        data: err.response?.data,
        status: err.response?.status,
      });
      toast.dismiss();
      toast.error("Request failed");
    } finally {
      setIsSending(false);
      setLoading(false);
    }
  };

  const clearFields = () => {
    setUrl("");
    setBody("");
    setMethod("GET");
  };

  const loadTemplate = (tpl) => {
    setUrl(tpl.url);
    setMethod(tpl.method);
    setBody(tpl.body);
  };

  const saveCurrentPreset = () => {
    if (!url || !presetName) {
      toast.error("Provide both URL and preset name");
      return;
    }
    const newPreset = { name: presetName, url, method, body };
    addPreset(newPreset);
    toast.success("Preset saved!");
    setPresetName("");
  };

  const loadPreset = (preset) => {
    setSelectedPreset(preset);
    setUrl(preset.url);
    setMethod(preset.method);
    setBody(preset.body);
  };

  const clearPresets = () => {
    localStorage.removeItem("api_presets");
    toast.success("Presets cleared!");
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-xl p-6 rounded-lg border border-blue-100"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
        {/* Method Selector */}
        <Listbox value={method} onChange={setMethod}>
          <div className="relative z-10">
            <Listbox.Button className="w-28 border px-3 py-2 rounded-md bg-white font-semibold text-left">
              <span className="flex items-center gap-2">
                {methodOptions.find((m) => m.name === method)?.icon}
                {method}
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-28 bg-white border rounded-md shadow-lg z-50">
              {methodOptions.map((m) => (
                <Listbox.Option
                  key={m.name}
                  value={m.name}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 flex items-center gap-2 ${
                      active ? "bg-blue-100" : ""
                    }`
                  }
                >
                  {m.icon} {m.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        {/* URL Input */}
        <input
          type="text"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border flex-1 p-2 rounded-md w-full text-gray-800"
        />

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 10px #3b82f6" }}
          whileTap={{ scale: 0.95 }}
          onClick={sendRequest}
          disabled={isSending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isSending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          {isSending ? "Sending" : "Send"}
        </motion.button>
      </div>

      {/* Body Input for POST/PUT */}
      {(method === "POST" || method === "PUT") && (
        <textarea
          className="w-full p-3 border rounded-md h-32 font-mono bg-gray-50"
          placeholder='{"key": "value"}'
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

      {/* Template Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={clearFields}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300"
        >
          <Trash className="w-4 h-4" /> Clear
        </button>

        {templates.map((tpl) => (
          <button
            key={tpl.name}
            onClick={() => loadTemplate(tpl)}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200"
          >
            <FilePlus className="w-4 h-4" /> {tpl.name}
          </button>
        ))}
      </div>

      {/* Save and Load Preset Dropdown */}
      <div className="mt-6 flex flex-col  md:flex-row gap-12">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Preset name"
          className="border p-2 rounded-md text-sm"
        />
        <button
          onClick={saveCurrentPreset}
          className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200"
        >
          <Save className="w-4 h-4" /> Save Preset
        </button>

        {presets.length > 0 && (
          <>
            <Listbox value={selectedPreset} onChange={loadPreset}>
              <div className="relative">
                <Listbox.Button className="w-48 border px-3 py-2 rounded-md bg-purple-100 text-purple-700 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  {selectedPreset?.name || "Load Preset"}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 overflow-y-auto w-48 bg-white border rounded-md shadow-lg z-50">
                  {presets.map((preset) => (
                    <Listbox.Option
                      key={preset.name}
                      value={preset}
                      className={({ active }) =>
                        `cursor-pointer px-3 py-2 ${
                          active ? "bg-purple-100" : ""
                        }`
                      }
                    >
                      {preset.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            <button
              onClick={clearPresets}
              className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"
            >
              <Trash2 className="w-4 h-4" /> Clear Presets
            </button>
          </>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-400 italic">
        Created by <span className="text-blue-600 font-semibold">Aman</span>
      </div>
    </motion.div>
  );
};

export default RequestForm;
