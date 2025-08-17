import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

interface VisitorData {
  uniqueVisitors: number
  lastUpdated: string
  ipAddresses: string[]
}

const DATA_FILE = path.join(process.cwd(), "visitor-data.json")

async function getVisitorData(): Promise<VisitorData> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return {
      uniqueVisitors: 0,
      lastUpdated: new Date().toISOString(),
      ipAddresses: [],
    }
  }
}

async function saveVisitorData(data: VisitorData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  return "unknown"
}

export async function GET() {
  try {
    const data = await getVisitorData()
    return NextResponse.json({ uniqueVisitors: data.uniqueVisitors })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get visitor data" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    if (clientIP === "unknown" || !clientIP) {
      return NextResponse.json(
        { error: "Could not determine IP" },
        { status: 400 }
      )
    }

    const data = await getVisitorData()
    if (!data.ipAddresses.includes(clientIP)) {
      data.ipAddresses.push(clientIP)
      data.uniqueVisitors = data.ipAddresses.length
      data.lastUpdated = new Date().toISOString()
      await saveVisitorData(data)
    }
    return NextResponse.json({ uniqueVisitors: data.uniqueVisitors })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update visitor data" },
      { status: 500 }
    )
  }
}