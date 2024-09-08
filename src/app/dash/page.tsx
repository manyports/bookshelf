"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Archive,
  Book,
  BookOpen,
  Languages,
  Lightbulb,
  MessageCircle,
  Pencil,
  Timer,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sections = [
  {
    icon: Languages,
    title: "Словарь",
    description:
      "Расширяйте свой словарный запас и улучшайте понимание прочитанного",
    href: "/dictionary",
  },
  {
    icon: Book,
    title: "BookMatch",
    description:
      "Находите книги, идеально соответствующие вашим интересам и предпочтениям",
    href: "/bookmatch",
  },
  {
    icon: BookOpen,
    title: "Wordle",
    description:
      "Играйте в увлекательную игру со словами из ваших любимых книг",
    href: "/wordle",
  },
  {
    icon: MessageCircle,
    title: "Чат",
    description:
      "Обсуждайте прочитанные книги с искусственным интеллектом и получайте новые идеи",
    href: "/chat",
  },
  {
    icon: Users,
    title: "Форум",
    description:
      "Общайтесь с другими читателями, делитесь мнениями и находите единомышленников",
    href: "/forum",
  },
  {
    icon: Archive,
    title: "Читать",
    description:
      "Получите доступ к вашей личной библиотеке и продолжайте чтение с того места, где остановились",
    href: "/read",
  },
  {
    icon: Lightbulb,
    title: "Предложения",
    description:
      "Получайте персонализированные рекомендации книг на основе ваших предпочтений",
    href: "/suggest",
  },
  {
    icon: Pencil,
    title: "Заметки",
    description:
      "Создавайте и организуйте заметки о прочитанных книгах для лучшего усвоения материала",
    href: "/notes",
  },
  {
    icon: Timer,
    title: "Игра",
    description:
      "Отслеживайте свой прогресс чтения и соревнуйтесь с друзьями в чтении",
    href: "/game",
  },
];

const dummyData = [
  { name: "Янв", time: 4, tomatoes: 20 },
  { name: "Фев", time: 3, tomatoes: 15 },
  { name: "Мар", time: 5, tomatoes: 25 },
  { name: "Апр", time: 7, tomatoes: 35 },
  { name: "Май", time: 6, tomatoes: 30 },
  { name: "Июн", time: 8, tomatoes: 40 },
];

export default function ЛичныйАккаунт() {
  const [chartMetric, setChartMetric] = useState("time");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Личный Аккаунт
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">
                Ваш Прогресс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={chartMetric} onValueChange={setChartMetric}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите метрику" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Время чтения</SelectItem>
                    <SelectItem value="tomatoes">Помидоры</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `${value}${chartMetric === "time" ? "ч" : ""}`
                      }
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey={chartMetric}
                      stroke="#8884d8"
                      fill="url(#colorGradient)"
                      fillOpacity={0.3}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Прочитано книг
                  </p>
                  <p className="text-3xl font-bold text-gray-700">24</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Часов чтения
                  </p>
                  <p className="text-3xl font-bold text-gray-700">156</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Собрано помидоров
                  </p>
                  <p className="text-3xl font-bold text-gray-700">720</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={section.href}>
                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
                      <section.icon className="w-6 h-6 mr-2 group-hover:text-purple-600 transition-colors duration-300" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {section.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}