"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Moon,
  Search,
  Sun,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  "//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

interface BookType {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  pages: number;
  pdfUrl: string;
}

export default function BookArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [scale, setScale] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const books: BookType[] = [
    {
      id: 1,
      title: "Война и мир",
      author: "Лев Толстой",
      category: "Классическая литература",
      year: 1869,
      pages: 1097,
      pdfUrl:
        "https://utfs.io/f/6492c262-5bd5-4b02-8e14-e9b15c43c6a5-8hptht.pdf",
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      category: "Классическая литература",
      year: 1866,
      pages: 324,
      pdfUrl:
        "https://utfs.io/f/359f0913-d5cc-462e-98bd-2aeb6fbb0b4f-vd90xk.pdf",
    },
    {
      id: 3,
      title: "Абай Жолы І",
      author: "Мухтар Ауезов",
      category: "Классическая литература",
      year: 1942,
      pages: 182,
      pdfUrl:
        "https://utfs.io/f/29f2998f-bbd1-4774-b7dc-8671c8d3901a-o8xn4n.pdf",
    },
  ];

  const filteredBooks = books.filter(
    (book) =>
      (selectedCategory === "all" || book.category === selectedCategory) &&
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changeScale = (newScale: string) => {
    setScale(parseFloat(newScale));
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < (numPages || 1) ? prev + 1 : prev));
  };

  const BookContent = ({ book }: { book: BookType | null }) => {
    if (!book) return null;

    return (
      <>
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{book.title}</h2>
        <h3 className="text-lg md:text-xl mb-4 md:mb-6">{book.author}</h3>
        <p className="mb-4">
          Страница {currentPage} из {numPages}
        </p>
        <Document
          file={book.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          options={{
            cMapUrl: "cmaps/",
            cMapPacked: true,
          }}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={containerRef.current?.clientWidth}
          />
        </Document>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Цифровой архив книг</h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
        Исследуйте нашу обширную коллекцию цифровых книг
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск книг..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="Классическая литература">
              Классическая литература
            </SelectItem>
            <SelectItem value="Современная классика">
              Современная классика
            </SelectItem>
            <SelectItem value="Научная фантастика">
              Научная фантастика
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <li key={book.id}>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-4"
                  onClick={() => {
                    setSelectedBook(book);
                    setCurrentPage(1);
                  }}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <Book className="mr-2 h-4 w-4" />
                      <span className="font-medium">{book.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {book.author}, {book.year}
                    </span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
                <div className="flex flex-col h-full">
                  <div className="bg-muted p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        {selectedBook?.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={scale.toString()}
                        onValueChange={changeScale}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Масштаб" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">50%</SelectItem>
                          <SelectItem value="0.75">75%</SelectItem>
                          <SelectItem value="1">100%</SelectItem>
                          <SelectItem value="1.25">125%</SelectItem>
                          <SelectItem value="1.5">150%</SelectItem>
                          <SelectItem value="2">200%</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={zoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={zoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      >
                        {isDarkMode ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex-grow overflow-y-auto">
                    <div
                      ref={containerRef}
                      className="p-4 md:p-8"
                      style={{
                        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                        color: isDarkMode ? "#e0e0e0" : "#333333",
                      }}
                    >
                      <BookContent book={selectedBook} />
                    </div>
                  </div>
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">Предыдущая</span>
                    </Button>
                    <span className="text-sm md:text-base">
                      Страница {currentPage} из {numPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === numPages}
                    >
                      <span className="hidden md:inline">Следующая</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </div>
  );
}