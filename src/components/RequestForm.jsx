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
    url: "https://jsonplaceholder.typicode.com/posts",
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

const RequestForm = ({ setResponse, setLoading }) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

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

      setResponse({
        status: res.status,
        headers: res.headers,
        data: res.data,
        time: (endTime - startTime).toFixed(2),
      });

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-xl p-6 rounded-lg border border-blue-100"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
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

        <input
          type="text"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border flex-1 p-2 rounded-md w-full text-gray-800"
        />

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

      {(method === "POST" || method === "PUT") && (
        <textarea
          className="w-full p-3 border rounded-md h-32 font-mono bg-gray-50"
          placeholder='{"key": "value"}'
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

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
    </motion.div>
  );
};

export default RequestForm;
