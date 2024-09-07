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
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sections = [
  {
    icon: Languages,
    title: "Словарь",
    description: "Исследуйте свою личную коллекцию слов",
    href: "/dictionary",
  },
  {
    icon: Book,
    title: "BookMatch",
    description: "Найдите свою следующую любимую книгу",
    href: "/bookmatch",
  },
  {
    icon: BookOpen,
    title: "Wordle",
    description: "Играйте в Wordle с названиями книг",
    href: "/wordle",
  },
  {
    icon: MessageCircle,
    title: "Чат",
    description: "Обсуждайте книги с ИИ",
    href: "/chat",
  },
  {
    icon: Users,
    title: "Форум",
    description: "Участвуйте в обсуждениях книг",
    href: "/forum",
  },
  {
    icon: Archive,
    title: "Читать",
    description: "Получите доступ к своему архиву книг",
    href: "/read",
  },
  {
    icon: Lightbulb,
    title: "Предложения",
    description: "Получите рекомендации книг от ИИ",
    href: "/suggest",
  },
  {
    icon: Pencil,
    title: "Заметки",
    description: "Управляйте своими заметками для чтения",
    href: "/notes",
  },
  {
    icon: Timer,
    title: "Игра",
    description: "Отслеживайте свой прогресс в чтении",
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Личный Аккаунт</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ваше Влияние</CardTitle>
          <CardDescription>
            Отслеживайте свой прогресс в чтении со временем
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={chartMetric} onValueChange={setChartMetric}>
              <SelectTrigger>
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
              <LineChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={chartMetric}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <section.icon className="mr-2" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={section.href}>
                <Button className="w-full">Перейти к {section.title}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
