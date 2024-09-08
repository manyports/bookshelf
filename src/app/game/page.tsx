"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const books = [
  "Война и мир - Лев Толстой",
  "Преступление и наказание - Фёдор Достоевский",
  "Абай Жолы І - Мухтар Ауезов",
  "Весёлая наука - Ф. Ницце",
  "Ертегілер жинағы - Жорабек Алимжан",
  "Қаһар романы - Ілияс Есенберлин",
  "Қаздар қайтып барады - Қабдеш Жұмаділов",
  "Хан кене - Ілияс Есенберлин",
  "Қыз Жібек - Ғабит Мүсірепов",
];

type ReadingSession = {
  book: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tomatoes: number;
};

export default function ReadingTimer() {
  const [isReading, setIsReading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedBook, setSelectedBook] = useState("");
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalTomatoes, setTotalTomatoes] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isReading) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReading]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    if (!isReading) {
      if (selectedBook) {
        setStartTime(new Date());
        setIsReading(true);
      } else {
        alert("Пожалуйста, выберите книгу перед началом чтения.");
      }
    } else {
      setIsReading(false);
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - (startTime?.getTime() || 0)) / 1000
      );
      const tomatoes = Math.floor(duration / 600);
      setSessions([
        ...sessions,
        {
          book: selectedBook,
          startTime: startTime!,
          endTime,
          duration,
          tomatoes,
        },
      ]);
      setTotalTomatoes((prevTotal) => prevTotal + tomatoes);
      setSeconds(0);
      setSelectedBook("");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Счетчик чтения</h1>

      <div className="mb-6">
        <Select onValueChange={setSelectedBook} value={selectedBook}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите книгу" />
          </SelectTrigger>
          <SelectContent>
            {books.map((book) => (
              <SelectItem key={book} value={book}>
                {book}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-4">{formatTime(seconds)}</div>
        <Button onClick={handleStartStop} className="w-full">
          {isReading ? "Остановить" : "Начать чтение"}
        </Button>
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-semibold">
          Всего помидоров: {totalTomatoes} 🍅
        </div>
      </div>

      <div className="text-sm text-center mb-6">
        Помидоры 🍅 засчитываются только при чтении в библиотеке. 10 минут = 1
        🍅
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">История чтения</h2>
        {sessions.map((session, index) => (
          <div key={index} className="border p-3 rounded">
            <div className="font-medium">{session.book}</div>
            <div>Начало: {session.startTime.toLocaleTimeString()}</div>
            <div>Конец: {session.endTime.toLocaleTimeString()}</div>
            <div>Длительность: {formatTime(session.duration)}</div>
            <div>Заработано помидоров: {session.tomatoes} 🍅</div>
          </div>
        ))}
      </div>
    </div>
  );
}
