"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const books = [
  { title: "Война и мир", author: "Лев Толстой", year: 1869 },
  {
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
  },
  { title: "Абай Жолы І", author: "Мухтар Ауезов", year: 1942 },
  { title: "Весёлая наука", author: "Ф. Ницце", year: 1882 },
  { title: "Ертегілер жинағы", author: "Жорабек Алимжан", year: 2022 },
  { title: "Қаһар романы", author: "Ілияс Есенберлин", year: 2003 },
  { title: "Қаздар қайтып барады", author: "Қабдеш Жұмаділов", year: 1968 },
  { title: "Хан кене", author: "Ілияс Есенберлин", year: 1969 },
  { title: "Қыз Жібек", author: "Ғабит Мүсірепов", year: 1971 },
];

type Review = {
  name: string;
  content: string;
};

export default function BookForum() {
  const [selectedBook, setSelectedBook] = useState<(typeof books)[0] | null>(
    null
  );
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSelectBook = (book: (typeof books)[0]) => {
    setSelectedBook(book);
    if (!reviews[book.title]) {
      setReviews({ ...reviews, [book.title]: [] });
    }
    setIsDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (selectedBook && name && review) {
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookTitle: selectedBook.title,
            name,
            content: review,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit review");
        }

        const updatedReviews = {
          ...reviews,
          [selectedBook.title]: [
            ...(reviews[selectedBook.title] || []),
            { name, content: review },
          ],
        };
        setReviews(updatedReviews);
        setName("");
        setReview("");
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Книжный форум</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card
            key={book.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSelectBook(book)}
          >
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>
                {book.author}, {book.year}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBook.title}</DialogTitle>
                <DialogDescription>
                  {selectedBook.author}, {selectedBook.year}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ScrollArea className="h-[200px] mb-4 rounded border p-4">
                  {reviews[selectedBook.title]?.map((review, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-gray-600">{review.content}</p>
                    </div>
                  ))}
                </ScrollArea>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitReview();
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Ваше сообщение"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <Button type="submit" className="w-full">
                    Отправить!
                  </Button>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
