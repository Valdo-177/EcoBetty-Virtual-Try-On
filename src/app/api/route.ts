// pages/api/message.ts

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    hello: 'World'
  })
}