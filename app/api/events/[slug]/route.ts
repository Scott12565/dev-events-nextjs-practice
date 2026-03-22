import { NextRequest, NextResponse } from 'next/server';

import { connectDB } from '@/lib/mongodb';
import { Event } from '@/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Next.js 15+ makes route params a Promise; await before reading values
interface RouteContext {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Sanitisation & Validation
// ---------------------------------------------------------------------------

/**
 * Sanitise a raw slug param:
 * - trim leading/trailing whitespace
 * - normalise to lowercase so lookups are case-insensitive
 */
function sanitizeSlug(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Accepts any non-empty string that contains only lowercase letters, digits,
 * and hyphens — no structural assumptions about where hyphens may appear.
 */
const SLUG_REGEX = /^[a-z0-9-]+$/;

function isValidSlug(value: string): boolean {
  return value.length > 0 && SLUG_REGEX.test(value);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { slug: rawSlug } = await params;
  // Sanitise before any validation or DB use
  const slug = sanitizeSlug(rawSlug);

  // Guard: slug must be present and well-formed
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json(
      {
        error:
          'Invalid slug. Slugs must be non-empty, lowercase, and contain only letters, digits, and hyphens.',
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Use .lean() to return a plain object instead of a Mongoose document —
    // cheaper serialisation and safe to send directly as JSON
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { error: `No event found with slug "${slug}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: event }, { status: 200 });
  } catch (error) {
    // Log the full error server-side; never expose internal details to clients
    console.error(`[GET /api/events/${slug}]`, error);

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
