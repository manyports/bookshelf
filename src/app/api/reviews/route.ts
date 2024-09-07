import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI!;

type Review = {
  bookTitle: string;
  name: string;
  content: string;
};

let client: MongoClient | null = null;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db();
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");
    const allReviews = await reviewsCollection.find().toArray();
    const reviews = allReviews.map((doc) => ({
      bookTitle: doc.bookTitle,
      name: doc.name,
      content: doc.content,
    })) as Review[];

    const reviewsByBook = reviews.reduce(
      (
        acc: Record<string, { name: string; content: string }[]>,
        review: Review
      ) => {
        if (!acc[review.bookTitle]) {
          acc[review.bookTitle] = [];
        }
        acc[review.bookTitle].push({
          name: review.name,
          content: review.content,
        });
        return acc;
      },
      {}
    );

    return NextResponse.json(reviewsByBook);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { bookTitle, name, content } = (await req.json()) as Review;
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");
    await reviewsCollection.insertOne({ bookTitle, name, content });
    return NextResponse.json(
      { message: "Review added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}
