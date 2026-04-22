import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/config/mongodb';
import Match from '@/models/matchSchema';
import { MatchType } from '@/types/match';

// GET all matches
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const matches = await Match.find({});
    return NextResponse.json({ success: true, data: matches }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Create a new match
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const data: MatchType = await request.json();
    
    const match = new Match(data);
    await match.save();
    
    return NextResponse.json({ success: true, data: match }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
