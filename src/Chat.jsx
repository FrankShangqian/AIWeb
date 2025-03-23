import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
// Chat 组件
const Chat = () => {
   // 聊天记录状态，格式为 [{ role: "user"|"bot", content: "消息内容" }]
  const [messages, setMessages] = useState([]);
   // 输入框内容状态
  const [input, setInput] = useState("");
  // 请求过程中 loading 状态
  const [loading, setLoading] = useState(false); 
   // 聊天容器的引用，用于控制滚动
  const chatContainerRef = useRef(null);
  // API 地址从 .env 配置中读取
  const apiURL = import.meta.env.VITE_API_URL;

  // 每次消息更新后，自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 发送消息函数
  const sendMessage = async () => {
    if (!input.trim()) return;// 输入为空则不发送

    setLoading(true);  // 设置加载状态
    // 添加用户消息到聊天记录
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");// 清空输入框

    try {
      // 向后端发送请求
      const response = await axios.post(`${apiURL}/api/chat`, {
        prompt: input,
      });
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: response.data.message },
      ]);
    } catch (error) {
      console.error("API 请求失败:", error.response || error.message);
      // 将 bot 回复添加到聊天记录
      setMessages((prev) => [
        // 显示错误消息
        ...prev,
        { role: "bot", content: "请求失败，请稍后再试。" },
      ]);
    } finally {
      setLoading(false); // 请求完成后，恢复按钮可用
    }
  };

  // 监听键盘 Enter 键
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  // UI 渲染
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
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
        {/* 头部标题 */}
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
          {/* 遍历消息列表，展示每一条消息 */}
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";// 判断是用户还是机器人
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",// 用户右对齐，机器人左对齐
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
                    whiteSpace: "pre-wrap",// 保留换行格式
                    lineHeight: "1.4",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* 输入与发送区 */}
        <div
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ccc",
          }}
        >
          {/* 输入框 */}
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
          {/* 发送按钮或 loading 状态 */}
          {loading ? (
            <button
              className="loading-button" // CSS 中添加加载按钮样式
              disabled
            >
              <div className="spinner"></div>
            </button>
          ) : (
            <button
              onClick={sendMessage}
              className="send-button"// CSS 中自定义发送按钮样式
            >
              发送
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;