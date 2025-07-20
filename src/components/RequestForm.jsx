// src/components/RequestForm.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import {
  SendHorizonal,
  Loader2,
  ArrowRightLeft,
  Upload,
  FilePen,
  Trash2,
} from "lucide-react";

const methods = [
  {
    name: "GET",
    icon: <ArrowRightLeft className="text-green-600 h-4 w-4" />,
    color: "text-green-600",
  },
  {
    name: "POST",
    icon: <Upload className="text-yellow-600 h-4 w-4" />,
    color: "text-yellow-600",
  },
  {
    name: "PUT",
    icon: <FilePen className="text-blue-600 h-4 w-4" />,
    color: "text-blue-600",
  },
  {
    name: "DELETE",
    icon: <Trash2 className="text-red-600 h-4 w-4" />,
    color: "text-red-600",
  },
];

const RequestForm = ({ setResponse, setLoading }) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState(methods[0]);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendRequest = async () => {
    setIsSending(true);
    setLoading(true);
    toast.loading("Sending request...");

    try {
      const config = {
        method: method.name,
        url,
        data: method.name !== "GET" ? JSON.parse(body || "{}") : undefined,
      };
      const res = await axios(config);
      setResponse({
        status: res.status,
        headers: res.headers,
        data: res.data,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-xl p-6 rounded-lg border border-blue-100"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
        {/* Custom Dropdown */}
        <div className="relative z-10">
          <Listbox value={method} onChange={setMethod}>
            <Listbox.Button
              className={`w-28 border px-3 py-2 rounded-md bg-white font-semibold shadow-sm ${method.color} hover:ring-2 hover:ring-blue-300`}
            >
              <span className="flex items-center gap-2">
                {method.icon}
                {method.name}
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-28 bg-white border rounded-md shadow-md z-50">
              {methods.map((m) => (
                <Listbox.Option
                  key={m.name}
                  value={m}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 flex items-center gap-2 ${
                      active ? "bg-blue-100" : ""
                    }`
                  }
                >
                  {m.icon}
                  {m.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>

        {/* URL Input */}
        <input
          type="text"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border flex-1 p-2 rounded-md w-full text-gray-800"
        />

        {/* Send Button with Animation */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 8px rgba(59,130,246,0.6)",
          }}
          onClick={sendRequest}
          disabled={isSending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
        >
          {isSending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          {isSending ? "Sending" : "Send"}
        </motion.button>
      </div>

      {/* Body TextArea */}
      {(method.name === "POST" || method.name === "PUT") && (
        <textarea
          className="w-full p-3 border rounded-md h-32 font-mono bg-gray-50"
          placeholder='{"key": "value"}'
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}
    </motion.div>
  );
};

export default RequestForm;
