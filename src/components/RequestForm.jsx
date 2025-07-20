// RequestForm.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  SendHorizonal,
  Loader2,
  ArrowRightLeft,
  Upload,
  Trash2,
  FilePen,
} from "lucide-react";

const methodIcons = {
  GET: <ArrowRightLeft className="inline-block mr-1 text-green-600" />,
  POST: <Upload className="inline-block mr-1 text-yellow-600" />,
  PUT: <FilePen className="inline-block mr-1 text-blue-600" />,
  DELETE: <Trash2 className="inline-block mr-1 text-red-600" />,
};

const methodColors = {
  GET: "text-green-600",
  POST: "text-yellow-600",
  PUT: "text-blue-600",
  DELETE: "text-red-600",
};

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
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`border p-2 rounded-md font-semibold bg-gray-100 ${methodColors[method]}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border flex-1 p-2 rounded-md w-full text-gray-800"
        />

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 8px #3b82f6" }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={sendRequest}
          disabled={isSending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-60 cursor-pointer hover:cursor-pointer"
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
    </motion.div>
  );
};

export default RequestForm;
