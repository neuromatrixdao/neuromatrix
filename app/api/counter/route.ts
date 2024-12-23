import { NextResponse } from 'next/server'
import { incrementGlobalCounter, getLatestTask, getGlobalCounter } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: counterData, error: counterError } = await getGlobalCounter()
    if (counterError) {
      return NextResponse.json({ error: counterError.message }, { status: 500 })
    }

    const { data: taskData, error: taskError } = await getLatestTask()
    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 500 })
    }

    return NextResponse.json({
      counter: counterData,
      latestTask: taskData
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { data: counterData, error: counterError } = await incrementGlobalCounter()
    if (counterError) {
      return NextResponse.json({ error: counterError.message }, { status: 500 })
    }

    const { data: taskData, error: taskError } = await getLatestTask()
    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 500 })
    }

    return NextResponse.json({
      counter: counterData,
      latestTask: taskData
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 