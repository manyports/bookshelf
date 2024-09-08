"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Archive,
  ArrowRight,
  Book,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  PenTool,
  Plus,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactTypingEffect from "react-typing-effect";

const AnimatedCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorRef.current.style.left = `${e.clientX}px`;
      }
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="md:fixed w-6 h-6 rounded-full border-2 border-black pointer-events-none z-50 transition-transform duration-100 ease-out"
      style={{ transform: "translate(-50%, -50%)" }}
    />
  );
};

const features = [
  {
    title: "Wordle для книг",
    description: "Угадывайте названия книг в нашей ежедневной игре",
    icon: Book,
    content: (
      <div className="grid grid-cols-5 gap-2">
        {["С", "Т", "Р", "А", "Х"].map((letter, index) => (
          <motion.div
            key={index}
            className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold ${
              letter ? "border-black" : "border-gray-300"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {letter}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    title: "Архив книг",
    description: "Доступ к обширной библиотеке произведений",
    icon: Archive,
    content: (
      <motion.div
        className="w-64 h-80 bg-gray-100 rounded shadow-lg"
        initial={{ rotateY: -90 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="h-full flex items-center justify-center">
          <Book size={48} />
        </div>
      </motion.div>
    ),
  },
  {
    title: "Интерактивное чтение",
    description: "Погрузитесь в мир книг с нашими интерактивными функциями",
    icon: Book,
    content: (
      <div className="relative w-64 h-80 bg-gray-100 rounded shadow-lg overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-white p-4"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-2">Глава 1: Начало</h3>
          <p className="text-sm">
            Это был темный и бурный вечер. Ветер завывал...
          </p>
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full text-white border-white"
          >
            Перевернуть страницу
          </Button>
        </motion.div>
      </div>
    ),
  },
  {
    title: "AI Чат",
    description: "Обсуждайте книги с нашим AI-ассистентом",
    icon: MessageSquare,
    content: (
      <div className="space-y-4 max-w-md">
        <motion.div
          className="bg-gray-100 p-3 rounded-lg"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Что вы думаете о главном герое "1984"?
        </motion.div>
        <motion.div
          className="bg-black text-white p-3 rounded-lg ml-auto"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ReactTypingEffect
            text={[
              "Уинстон Смит - сложный персонаж, символизирующий борьбу за индивидуальность в тоталитарном обществе.",
            ]}
            speed={50}
            eraseDelay={2000}
          />
        </motion.div>
      </div>
    ),
  },
  {
    title: "ИИ оценит книгу для вас",
    description: "Спросите у ИИ книгу, он вам предложит, да оценит",
    icon: Star,
    content: (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-bold">"Ромео и Джульетта"</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              className="text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              ⭐
            </motion.button>
          ))}
        </div>
        <Button>Дана, оцени еще эту книгу!</Button>
      </div>
    ),
  },
  {
    title: "Форум читателей",
    description: "Обсуждайте книги с единомышленниками",
    icon: Users,
    content: (
      <div className="space-y-4 max-w-md">
        <motion.div
          className="bg-gray-100 p-3 rounded-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <strong>Алимжан:</strong> Как вам новый роман Исигуро?
        </motion.div>
        <motion.div
          className="bg-gray-100 p-3 rounded-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <strong>Ерасыл:</strong> Потрясающе! Особенно понравилась атмосфера.
        </motion.div>
      </div>
    ),
  },
  {
    title: "Геймификация чтения",
    description: "Отслеживайте свой прогресс и ставьте цели",
    icon: Clock,
    content: (
      <div className="w-64 h-80 bg-gray-100 rounded shadow-lg p-4">
        <h3 className="text-lg font-bold mb-4">Ваш прогресс</h3>
        <div className="space-y-4">
          <div>
            <motion.div
              className="h-4 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            <p className="text-sm mt-1">6 помидоров</p>
          </div>
          <div>
            <p className="text-sm mb-1">Часов потрачено:</p>
            <motion.div
              className="h-4 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: "66%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            <p className="text-sm mt-1">6ч</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Интерактивные заметки",
    description: "Создавайте и организуйте заметки прямо во время чтения",
    icon: PenTool,
    content: (
      <div className="w-64 h-80 bg-gray-100 rounded shadow-lg p-4 overflow-hidden">
        <h3 className="text-lg font-bold mb-2">Ваши заметки</h3>
        <div className="space-y-2">
          {[
            "Интересная мысль на стр. 42",
            "Ключевой момент в главе 3",
            "Вопрос к автору",
          ].map((note, index) => (
            <motion.div
              key={index}
              className="bg-white p-2 rounded shadow cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {note}
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute bottom-4 right-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    ),
  },
];

const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const nextFeature = () =>
    setCurrentFeature((prev) => (prev + 1) % features.length);
  const prevFeature = () =>
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);

  useEffect(() => {
    const timer = setInterval(nextFeature, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold">
            {features[currentFeature].title}
          </h3>
          <p className="text-gray-600">
            {features[currentFeature].description}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevFeature}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextFeature}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center h-96"
        >
          {features[currentFeature].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ParallaxSection = ({ children }: { children: React.ReactNode }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div style={{ y }} className="relative z-10">
      {children}
    </motion.div>
  );
};

export default function EnhancedInteractiveLanding() {
  return (
    <div className="min-h-screen bg-white text-black">
      <AnimatedCursor />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ReactTypingEffect
                text={[
                  "Переосмыслите чтение",
                  "Откройте новые миры",
                  "Погрузитесь в истории",
                  "Расширьте свой кругозор",
                ]}
                speed={50}
                eraseSpeed={50}
                typingDelay={1000}
                eraseDelay={2000}
                className="text-3xl md:text-6xl font-bold mb-6"
              />
            </motion.div>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Откройте для себя новый мир литературы с помощью AI и
              инновационных инструментов
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
              >
                <Link href="/dash">
                  Начать бесплатно <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Исследуйте наши возможности
          </h2>
          <FeatureShowcase />
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Зайдите на профиль",
                description: "Зайдите на профиль и ознакомьтесь с ним",
              },
              {
                title: "Выберите книгу",
                description:
                  "Используйте AI-рекомендации или просматривайте библиотеку",
              },
              {
                title: "Погрузитесь в чтение",
                description:
                  "Читайте, делайте заметки и обсуждайте прочитанное",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Готовы начать?</h2>
          <p className="text-xl mb-8">
            Присоединяйтесь к сообществу книголюбов и откройте для себя новый
            мир чтения
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-200"
          >
            <Link href="/dash">
              Попробовать сейчас <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
