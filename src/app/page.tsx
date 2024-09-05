"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  quote: string;
  genre: string;
};

const books: Book[] = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    quote: "War is peace. Freedom is slavery. Ignorance is strength.",
    genre: "Dystopian",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    quote:
      "You never really understand a person until you consider things from his point of view.",
    genre: "Classic",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    quote:
      "So we beat on, boats against the current, borne back ceaselessly into the past.",
    genre: "Literary Fiction",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    quote:
      "For what do we live, but to make sport for our neighbors, and laugh at them in our turn?",
    genre: "Romance",
  },
];

const quoteOfTheDay = {
  text: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
};

const wordOfTheDay = {
  word: "Serendipity",
  definition:
    "The occurrence and development of events by chance in a happy or beneficial way.",
};

export default function BookMatch() {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | "">("");
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState<"main" | "library">("main");

  const currentBook = books[currentBookIndex];

  const handleSwipe = (swipeDirection: "left" | "right") => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(swipeDirection);

    setTimeout(() => {
      setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
      setDirection("");
      setIsAnimating(false);
    }, 300);
  };

  const handleLike = () => {
    if (!likedBooks.some((book) => book.id === currentBook.id)) {
      setLikedBooks([...likedBooks, currentBook]);
    } else {
      setLikedBooks(likedBooks.filter((book) => book.id !== currentBook.id));
    }
  };

  const isLiked = likedBooks.some((book) => book.id === currentBook.id);

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 lg:p-12 bg-white text-black">
      <div className="w-full lg:w-1/3 max-w-md mb-6 lg:mb-0 lg:mr-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-foreground">BookMatch</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full lg:hidden"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white text-black">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl font-semibold"
                  onClick={() => setCurrentPage("main")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl font-semibold"
                  onClick={() => setCurrentPage("library")}
                >
                  My Library ({likedBooks.length})
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Quote of the Day</h2>
            <p className="italic mb-1">&ldquo;{quoteOfTheDay.text}&rdquo;</p>
            <p className="text-sm text-muted-foreground">
              - {quoteOfTheDay.author}
            </p>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Word of the Day</h2>
            <p className="font-medium mb-1">{wordOfTheDay.word}</p>
            <p className="text-sm">- {wordOfTheDay.definition}</p>
          </CardContent>
        </Card>
        <div className="hidden lg:flex flex-col space-y-2 bg-white text-black">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setCurrentPage("main")}
          >
            Main Page
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setCurrentPage("library")}
          >
            My Library ({likedBooks.length})
          </Button>
        </div>
      </div>

      <div className="w-full lg:w-2/3 max-w-2xl">
        {currentPage === "main" ? (
          <div className="relative w-full aspect-[3/4] lg:aspect-[4/3]">
            <Card
              className={`absolute inset-0 flex flex-col justify-between transition-all duration-300 ease-in-out ${
                direction === "left"
                  ? "-translate-x-full rotate-12 opacity-0"
                  : direction === "right"
                  ? "translate-x-full -rotate-12 opacity-0"
                  : "translate-x-0 rotate-0 opacity-100"
              }`}
            >
              <CardContent className="flex flex-col justify-between h-full p-6">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {currentBook.genre}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-1">
                    {currentBook.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentBook.author}
                  </p>
                  <Separator className="my-4" />
                  <p className="italic text-lg">
                    &ldquo;{currentBook.quote}&rdquo;
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSwipe("left")}
                  className="rounded-full transition-transform duration-200 hover:scale-110"
                  disabled={isAnimating}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Skip</span>
                </Button>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="icon"
                  onClick={handleLike}
                  className="rounded-full transition-transform duration-200 hover:scale-110"
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="sr-only">Like</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSwipe("right")}
                  className="rounded-full transition-transform duration-200 hover:scale-110"
                  disabled={isAnimating}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Library</h2>
            {likedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedBooks.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="p-4">
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {book.author}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>Your library is empty. Like some books to add them here!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
