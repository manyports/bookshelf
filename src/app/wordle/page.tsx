"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const books = ["ВОЙНА", "ТАЙНА", "КОРКА", "ТЕТРА", "ХАХАХ", "ДЖАНЕ", "МАСТЕ"];

const getRandomBook = () => books[Math.floor(Math.random() * books.length)];

type GuessResult = "bg-gray-200" | "bg-green-500" | "bg-yellow-500";

interface Guess {
  word: string;
  result: GuessResult[];
}

export default function BookWordle() {
  const [targetWord, setTargetWord] = useState<string>(getRandomBook());
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const checkGuess = useCallback(
    (guess: string): GuessResult[] => {
      const result: GuessResult[] = new Array(WORD_LENGTH).fill("bg-gray-200");
      const targetLetters = [...targetWord];
      const guessLetters = [...guess];

      // First pass: mark correct letters (green)
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          result[i] = "bg-green-500";
          targetLetters[i] = "*";
          guessLetters[i] = "*";
        }
      }

      // Second pass: mark present letters (yellow)
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] !== "*") {
          const index = targetLetters.indexOf(guessLetters[i]);
          if (index !== -1) {
            result[i] = "bg-yellow-500";
            targetLetters[index] = "*";
          }
        }
      }

      return result;
    },
    [targetWord]
  );

  useEffect(() => {
    if (guesses.length > 0) {
      const lastGuess = guesses[guesses.length - 1].word;
      if (lastGuess === targetWord) {
        toast.success(`Поздравляем! Вы угадали книгу: ${targetWord}`);
        setGameOver(true);
      } else if (guesses.length === MAX_GUESSES) {
        toast.error(`Игра окончена. Загаданная книга была: ${targetWord}`);
        setGameOver(true);
      }
    }
  }, [guesses, targetWord]);

  const handleGuess = useCallback(() => {
    const uppercaseGuess = currentGuess.toUpperCase().slice(0, WORD_LENGTH);
    if (uppercaseGuess.length !== WORD_LENGTH) {
      toast.error(`Название книги должно состоять из ${WORD_LENGTH} букв`);
      return;
    }
    const newGuess: Guess = {
      word: uppercaseGuess,
      result: checkGuess(uppercaseGuess),
    };
    setGuesses((prev) => [...prev, newGuess]);
    setCurrentGuess("");
  }, [currentGuess, checkGuess]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Enter" &&
        !gameOver &&
        currentGuess.length === WORD_LENGTH
      ) {
        handleGuess();
      }
    },
    [handleGuess, gameOver, currentGuess]
  );

  const renderGuess = useCallback((guess: Guess) => {
    return guess.word.split("").map((letter, index) => (
      <div
        key={index}
        className={`w-12 h-12 ${guess.result[index]} text-white font-bold text-2xl flex items-center justify-center rounded`}
      >
        {letter}
      </div>
    ));
  }, []);

  const resetGame = useCallback(() => {
    setTargetWord(getRandomBook());
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-4xl font-bold mb-8">Книжный Wordle</h1>

      <Card className="w-full max-w-md border-black mb-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {guesses.map((guess, i) => (
              <React.Fragment key={i}>{renderGuess(guess)}</React.Fragment>
            ))}
            {[...Array(MAX_GUESSES - guesses.length)].map((_, i) => (
              <React.Fragment key={`empty-${i}`}>
                {[...Array(WORD_LENGTH)].map((_, j) => (
                  <div
                    key={j}
                    className="w-12 h-12 border border-gray-300 rounded"
                  ></div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              disabled={gameOver}
              className="flex-grow border-black focus:ring-black focus:border-black"
              placeholder="Введите название книги"
            />
            <Button
              onClick={handleGuess}
              disabled={gameOver || currentGuess.length !== WORD_LENGTH}
              className="bg-black text-white hover:bg-gray-800"
            >
              Угадать
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-100 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Попытка {guesses.length}/{MAX_GUESSES}
          </p>
          <Button
            onClick={resetGame}
            variant="outline"
            className="border-black text-black hover:bg-gray-200"
          >
            Новая игра
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 text-center">
        <p className="mb-2">Правила игры:</p>
        <ul className="text-sm text-gray-600 list-disc list-inside">
          <li>Угадайте название книги из 5 букв</li>
          <li>Зеленый цвет - буква на правильном месте</li>
          <li>Желтый цвет - буква есть в слове, но не на этом месте</li>
          <li>Серый цвет - буквы нет в слове</li>
        </ul>
      </div>
    </div>
  );
}
