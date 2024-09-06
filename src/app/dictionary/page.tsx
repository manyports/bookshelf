"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Translation = {
  text: string;
  pos: string;
  gen?: string;
  syn?: Array<{ text: string }>;
  mean?: Array<{ text: string }>;
  ex?: Array<{ text: string; tr: Array<{ text: string }> }>;
};

type WordDefinition = {
  word: string;
  translations: Translation[];
};

const suggestedWords = [
  "Абсолютный",
  "Благодарность",
  "Восхищение",
  "Гармония",
  "Доброта",
];

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = useCallback(async (word: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/dictionary?word=${encodeURIComponent(word)}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Не удалось получить данные из словаря");
      }
      if (data.def && data.def.length > 0) {
        setSelectedWord({
          word: data.def[0].text,
          translations: data.def.map((def: any) => ({
            text: def.text,
            pos: def.pos,
            gen: def.gen,
            syn: def.tr[0]?.syn,
            mean: def.tr[0]?.mean,
            ex: def.tr[0]?.ex,
          })),
        });
      } else {
        setError("Определение не найдено");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при поиске слова"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm) {
      fetchDefinition(searchTerm);
    }
  }, [searchTerm, fetchDefinition]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (word: string) => {
    setSearchTerm(word);
    fetchDefinition(word);
  };

  useEffect(() => {
    if (searchTerm) {
      const debounceTimer = setTimeout(() => {
        fetchDefinition(searchTerm);
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, fetchDefinition]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brown-50 to-brown-100 p-4 sm:p-6 md:p-8 flex flex-col items-center bg-white">
      <Card className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-brown-800 text-center">
            Русский словарь
          </h1>

          <div className="mb-3 sm:mb-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Введите слово для поиска..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow border-brown-300 focus:ring-brown-500 focus:border-brown-500"
              />
              <Button
                onClick={handleSearch}
                className="bg-brown-600 text-white hover:bg-brown-700 transition-colors"
                disabled={loading}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Найти</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-6">
            {suggestedWords.map((word) => (
              <Badge
                key={word}
                variant="outline"
                className="cursor-pointer bg-brown-100 text-brown-800 hover:bg-brown-200 transition-colors text-xs sm:text-sm"
                onClick={() => handleSuggestionClick(word)}
              >
                {word}
              </Badge>
            ))}
          </div>

          {loading && <p className="text-center text-brown-600">Загрузка...</p>}

          {error && <p className="text-center text-red-600">{error}</p>}

          {selectedWord && !loading && !error && (
            <div className="bg-brown-50 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-brown-800">
                {selectedWord.word}
              </h2>
              {selectedWord.translations.map((translation, index) => (
                <div
                  key={index}
                  className="mb-4 pb-4 border-b border-brown-200 last:border-b-0"
                >
                  <p className="text-md sm:text-lg text-brown-600 mb-2">
                    <span className="font-semibold">Часть речи:</span>{" "}
                    {translation.pos}
                    {translation.gen && ` (${translation.gen})`}
                  </p>
                  {translation.syn && translation.syn.length > 0 && (
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold mb-1 text-brown-700">
                        Синонимы:
                      </h3>
                      <p className="text-brown-800">
                        {translation.syn.map((s) => s.text).join(", ")}
                      </p>
                    </div>
                  )}
                  {translation.mean && translation.mean.length > 0 && (
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold mb-1 text-brown-700">
                        Значения:
                      </h3>
                      <ul className="list-disc list-inside text-brown-800">
                        {translation.mean.map((m, i) => (
                          <li key={i}>{m.text}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {translation.ex && translation.ex.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-brown-700">
                        Примеры:
                      </h3>
                      <ul className="list-disc list-inside text-brown-800">
                        {translation.ex.map((example, i) => (
                          <li key={i}>
                            {example.text}
                            {example.tr && example.tr.length > 0 && (
                              <span className="italic">
                                {" "}
                                - {example.tr[0].text}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!selectedWord && !loading && !error && (
            <p className="text-center text-brown-600 text-sm sm:text-base">
              Введите слово для поиска или выберите из предложенных вариантов.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
