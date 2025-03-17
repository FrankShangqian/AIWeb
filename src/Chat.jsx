import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  // 每次 messages 变化后，滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim()) return;

    // 用户消息
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    // 清空输入框
    setInput("");
    try {
      // 请求后端
      const response = await axios.post("http://localhost:5000/api/chat", {
        prompt: input,
      });

      // AI 消息
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: response.data.message },
      ]);
    } catch (error) {
      console.error("API 请求失败:", error.response || error.message);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "请求失败，请稍后再试。" },
      ]);
    }
  };

  // 按 Enter 键发送
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    // 1. 外层容器：用 flex + 100vh 实现上下左右居中
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",         // 关键：与全局CSS配合，撑满视窗
      }}
    >
      {/* 2. 中间的聊天容器 */}
      <div
        style={{
          width: "60%",
          height: "80%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* 头部 */}
        <div
          style={{
            backgroundColor: "#3f51b5",
            color: "#fff",
            padding: "10px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          铁路专业知识AI
        </div>

        {/* 聊天消息区 */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "10px",
                    borderRadius: "10px",
                    color: isUser ? "#fff" : "#000",
                    backgroundColor: isUser ? "#1976d2" : "#e0e0e0",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* 输入区 */}
        <div
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ccc",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "0 20px",
              fontSize: "16px",
              backgroundColor: "#3f51b5",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;