'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Search, Star } from 'lucide-react'

type Book = {
  title: string
  author: string
  description: string
  genre: string
  rating: number
}

export default function BookRecommender() {
  const [prompt, setPrompt] = useState('')
  const [recommendedBook, setRecommendedBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getRecommendationFromServer = async (prompt: string): Promise<Book> => {
    const response = await fetch('/api/recommend-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendation');
    }

    return response.json();
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const book = await getRecommendationFromServer(prompt)
      setRecommendedBook(book)
    } catch (error) {
      console.error('Ошибка при получении рекомендации:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Дана - книжный рекомендатель</h1>
      
      <div className="w-full max-w-lg mb-12">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input 
            type="text" 
            placeholder="Введите ваши интересы или желаемую тему книги..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow border-black focus:ring-black focus:border-black"
          />
          <Button 
            onClick={handleSearch} 
            className="bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Найти книгу
              </>
            )}
          </Button>
        </div>
      </div>

      {recommendedBook && (
        <Card className="w-full max-w-2xl border-black">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{recommendedBook.title}</h2>
                <p className="text-xl text-gray-600 mb-2">{recommendedBook.author}</p>
              </div>
              <Badge variant="outline" className="mt-2 sm:mt-0 border-black text-black">
                {recommendedBook.genre}
              </Badge>
            </div>
            <Separator className="my-4 bg-black" />
            <p className="text-lg mb-6">{recommendedBook.description}</p>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(recommendedBook.rating) ? 'text-black fill-black' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-medium text-lg">{recommendedBook.rating}/5</span>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-100 p-4">
            <p className="text-sm text-gray-600">
              Эта книга рекомендована Даной на основе вашего запроса: "{prompt}"
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}