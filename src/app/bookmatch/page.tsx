"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Heart, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Book = {
  title: string;
  author: string;
  year: number;
  quote?: string;
};

const books: Book[] = [
  {
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    quote:
      "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.",
  },
  {
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    quote: "Тварь ли я дрожащая или право имею?",
  },
  {
    title: "Абай Жолы І",
    author: "Мухтар Ауезов",
    year: 1942,
    quote:
      "Знание чужого языка и культуры делает человека равноправным с этим народом.",
  },
  {
    title: "Весёлая наука",
    author: "Ф. Ницше",
    year: 1882,
    quote: "Без музыки жизнь была бы ошибкой.",
  },
  {
    title: "Ертегілер жинағы",
    author: "Жорабек Алимжан",
    year: 2022,
    quote: "Сказки - это мудрость народа, переданная через поколения.",
  },
  {
    title: "Қаһар романы",
    author: "Ілияс Есенберлин",
    year: 2003,
    quote: "История - учительница жизни.",
  },
  {
    title: "Қаздар қайтып барады",
    author: "Қабдеш Жұмаділов",
    year: 1968,
    quote:
      "Родина - это не просто место, где ты родился, это место, где живет твое сердце.",
  },
  {
    title: "Хан кене",
    author: "Ілияс Есенберлин",
    year: 1969,
    quote: "Свобода - это ответственность.",
  },
  {
    title: "Қыз Жібек",
    author: "Ғабит Мүсірепов",
    year: 1971,
    quote:
      "Любовь сильнее смерти и страха смерти. Только ею, только любовью держится и движется жизнь.",
  },
];

export default function Component() {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<"main" | "library" | "search">(
    "main"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  const currentBook = books[currentBookIndex];

  useEffect(() => {
    const timer = setTimeout(() => setShowQuote(true), 500);
    return () => clearTimeout(timer);
  }, [currentBookIndex]);

  const handleSwipe = (direction: "left" | "right") => {
    setShowQuote(false);
    if (direction === "right") {
      handleLike();
    }
    setTimeout(() => {
      setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
    }, 300);
  };

  const handleLike = () => {
    if (!likedBooks.some((book) => book.title === currentBook.title)) {
      setLikedBooks([...likedBooks, currentBook]);
    }
  };

  const isLiked = likedBooks.some((book) => book.title === currentBook.title);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="p-4 w-full z-10 bg-white/80 backdrop-blur-sm">
        <nav className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-2xl font-bold"
            onClick={() => setCurrentPage("main")}
          >
            КнигоМатч
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage("library")}
              className="bg-gray-100 hover:bg-gray-200"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Библиотека</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage("search")}
              className="bg-gray-100 hover:bg-gray-200"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Поиск</span>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4 pt-20 max-w-4xl">
        <AnimatePresence mode="wait">
          {currentPage === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col justify-center items-center"
            >
              <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-6"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {currentBook.title}
                    </h2>
                    <p className="text-xl text-gray-600">
                      {currentBook.author}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentBook.year}
                    </p>
                  </div>
                  <AnimatePresence>
                    {showQuote && currentBook.quote && (
                      <motion.p
                        className="text-lg italic text-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        &ldquo;{currentBook.quote}&rdquo;
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSwipe("left")}
                  className="rounded-full w-16 h-16 bg-gray-100 hover:bg-gray-200"
                >
                  <span className="text-2xl" role="img" aria-label="Дизлайк">
                    👎
                  </span>
                  <span className="sr-only">Пропустить</span>
                </Button>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleSwipe("right")}
                  className={`rounded-full w-16 h-16 ${
                    isLiked
                      ? "bg-pink-100 hover:bg-pink-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-2xl" role="img" aria-label="Лайк">
                    ❤️
                  </span>
                  <span className="sr-only">Нравится</span>
                </Button>
              </div>
            </motion.div>
          )}

          {currentPage === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold mb-8">Моя библиотека</h2>
              {likedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {likedBooks.map((book) => (
                    <motion.div
                      key={book.title}
                      className="bg-gray-100 p-6 rounded-lg shadow-md"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                      <p className="text-gray-600 mb-1">{book.author}</p>
                      <p className="text-sm text-gray-500 mb-4">{book.year}</p>
                      {book.quote && (
                        <p className="text-sm italic mb-4">
                          &ldquo;{book.quote}&rdquo;
                        </p>
                      )}
                      <Link href="/read" passHref>
                        <Button className="w-full">Читать</Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xl text-gray-600">
                  Ваша библиотека пуста. Добавьте книги, которые вам
                  понравились!
                </p>
              )}
            </motion.div>
          )}

          {currentPage === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold mb-8">Поиск книг</h2>
              <div className="mb-8">
                <Input
                  placeholder="Введите название книги или имя автора"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-lg p-6 rounded-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books
                  .filter(
                    (book) =>
                      book.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      book.author
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((book) => (
                    <motion.div
                      key={book.title}
                      className="bg-gray-100 p-6 rounded-lg shadow-md"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                      <p className="text-gray-600 mb-1">{book.author}</p>
                      <p className="text-sm text-gray-500 mb-4">{book.year}</p>
                      {book.quote && (
                        <p className="text-sm italic">
                          &ldquo;{book.quote}&rdquo;
                        </p>
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
