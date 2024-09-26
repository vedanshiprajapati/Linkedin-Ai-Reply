import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { CycleIcon, DownArrowIcon, SendIcon } from "./icons";

const AutoReplyPopup: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<
    { userMessage: string; aiReply: string }[]
  >([]);
  const [showGenerate, setShowGenerate] = useState(true);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // reply generate krne ka function
  const generateReply = async () => {
    if (prompt.trim() === "") {
      return;
    }
    setShowGenerate(false);
    const fakeGeneratedReply =
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
    setMessages((prevMessages) => [
      ...prevMessages,
      { userMessage: prompt, aiReply: fakeGeneratedReply },
    ]);
    setPrompt("");
  };

  // reply Insert krne ke liye ka function
  const insertReply = () => {
    if (messages.length > 0) {
      window.postMessage(
        {
          type: "FROM_POPUP",
          action: "insertReply",
          reply: messages[messages.length - 1].aiReply,
        },
        "*"
      );

      window.postMessage({ type: "CLOSE_POPUP" }, "*");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[990]"
        id="pop-up"
      />
      <div className="fixed flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] p-6 bg-white rounded-2xl  z-[999] font-sans border border-3 shadow-xl">
        {/* chat history  */}
        {messages.length > 0 && (
          <div
            ref={chatHistoryRef}
            className="my-4 border overflow-y-auto flex flex-col gap-4 max-h-80"
          >
            {messages.map((messagePair, index) => (
              <div key={index} className="flex flex-col gap-2">
                {/* User message on the right */}
                <div className="bg-gray-100 h-auto p-3 text-gray-700 rounded-lg self-end max-w-[250px] overflow-hidden">
                  {messagePair.userMessage}
                </div>
                {/* AI reply on the left */}
                <div className="bg-blue-100 p-3 text-gray-700 rounded-lg self-start max-w-[250px]">
                  {messagePair.aiReply}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input field */}
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Your Prompt"
          className="w-full p-3 mb-4 border border-slate-300 resize-y text-gray-700  rounded-2xl hover:border-none"
        />
        <div className="flex justify-end gap-2 items-center">
          {showGenerate && (
            <button
              onClick={generateReply}
              className="bg-blue-500 hover:bg-blue-600 text-white border-none py-2.5 px-4 rounded cursor-pointer text-base font-bold flex items-center gap-2"
            >
              <span>
                <SendIcon />
              </span>
              <span>Generate</span>
            </button>
          )}
          {messages.length > 0 && (
            <>
              <button
                onClick={insertReply}
                className="text-slate-700 border border-slate-700 py-2 px-3 rounded cursor-pointer flex items-center gap-2"
              >
                <span>
                  <DownArrowIcon />
                </span>
                <span>Insert</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white border-none py-2 px-4 rounded cursor-pointer flex items-center gap-2">
                <span>
                  <CycleIcon />
                </span>
                <span>Regenerate</span>
              </button>
            </>
          )}
        </div>

        {/* close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer text-2xl"
          onClick={() => window.postMessage({ type: "CLOSE_POPUP" }, "*")}
        >
          &times;
        </button> 
      </div>
    </>
  );
};

export default AutoReplyPopup;
