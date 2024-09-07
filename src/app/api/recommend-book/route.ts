import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment variables");
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

function extractJSONFromMarkdown(text: string): string {
  const jsonRegex = /```json\n([\s\S]*?)\n```/;
  const match = text.match(jsonRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text.trim();
}

export async function POST(request: Request) {
  const { prompt } = await request.json()

  if (!prompt) {
    return NextResponse.json({ message: 'Prompt is required' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(`Based on the following prompt: "${prompt}", recommend a book. Search the internet for a suitable book and provide the following information:
    - Title
    - Author
    - Description (a brief summary of the book)
    - Genre
    - Rating (on a scale of 1 to 5)

    Return your recommendation as a JSON object with the following structure:
    {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description of the book",
      "genre": "Book Genre",
      "rating": 4.5
    }
    
    Ensure that all fields are filled and the rating is a number between 1 and 5. Do not include any text outside of the JSON object.`);

    const response = result.response;
    const text = response.text();
    const jsonText = extractJSONFromMarkdown(text);
    
    let book;
    try {
      book = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ message: 'Invalid response format from AI' }, { status: 500 });
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error getting book recommendation:', error)
    return NextResponse.json({ message: 'Error getting book recommendation' }, { status: 500 })
  }
}