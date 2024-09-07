"use client";

import { ChevronRight, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function BookBuddy() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Привет, книголюб! Я твой AI Книжный Друг, работающий на базе Langchain и Google Gemini. Я готов анализировать литературу с точностью хирурга и остроумием стендап-комика. В какое литературное приключение мы отправимся?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { role: "user", content: input }];
      setMessages(newMessages as any);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from API");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let partialResponse = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          partialResponse += chunk;

          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = partialResponse;
            return newMessages;
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Ошибка в обработке запроса. Попробуйте еще раз.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Ой! Кажется, мои литературные нейроны немного перепутались. Давайте попробуем еще раз, хорошо?",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Готов к новому литературному путешествию! Какую книгу или автора мы будем исследовать на этот раз?",
      },
    ]);
    setInput("");
    setError(null);
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-white text-black font-mono">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">ИИ книжный друг</h1>
        <button
          onClick={handleNewChat}
          className="flex items-center px-3 py-2 bg-black text-white rounded transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Новый чат
        </button>
      </div>
      <div className="flex-grow overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-2 ${
                message.role === "user" ? "bg-gray-100" : "bg-black text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="flex items-center border-t border-gray-200 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your literary musings..."
          className="flex-grow bg-transparent text-sm focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="ml-2 p-1 hover:bg-gray-100 rounded"
          disabled={isLoading}
        >
          <ChevronRight className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </button>
      </div>
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Thinking...
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
