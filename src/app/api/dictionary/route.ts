import { NextResponse } from 'next/server'

const API_KEY = process.env.YANDEX_DICTIONARY_API_KEY
const API_URL = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get('word')

  if (!API_KEY) {
    return NextResponse.json({ error: 'API ключ не настроен на сервере' }, { status: 500 })
  }

  if (!word) {
    return NextResponse.json({ error: 'Слово для поиска не указано' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}&lang=ru-ru&text=${encodeURIComponent(word)}`)
    if (!response.ok) {
      throw new Error('Не удалось получить данные из словаря')
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Произошла ошибка при поиске слова' }, { status: 500 })
  }
}