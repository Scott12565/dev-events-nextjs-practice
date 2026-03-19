import mongoose, { Document, Model, Schema } from 'mongoose';

// Restrict mode to known values while keeping the field a plain string in MongoDB
export type EventMode = 'online' | 'offline' | 'hybrid';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a title into a URL-safe slug (lowercase, hyphen-separated). */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // strip special characters
    .replace(/[\s_]+/g, '-')    // spaces / underscores → hyphens
    .replace(/-{2,}/g, '-');    // collapse consecutive hyphens
}

/**
 * Normalise a date string to YYYY-MM-DD.
 * Throws a descriptive error if the value cannot be parsed.
 */
function toISODate(value: string): string {
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: "${value}". Expected a parseable date string.`);
  }
  // Slice "YYYY-MM-DD" from the full ISO string
  return parsed.toISOString().slice(0, 10);
}

/**
 * Normalise a time string to 24-hour HH:MM format.
 * Accepts:  "9:05", "09:05", "09:05:30", "9:05 AM", "9:05 PM"
 * Throws if the value does not match a known pattern.
 */
function toNormalisedTime(value: string): string {
  // 12-hour: "9:05 AM" / "09:05:30 PM"
  const twelve = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (twelve) {
    let h = parseInt(twelve[1], 10);
    const m = twelve[2];
    const period = twelve[3].toUpperCase();
    if (period === 'AM' && h === 12) h = 0;
    if (period === 'PM' && h !== 12) h += 12;
    return `${String(h).padStart(2, '0')}:${m}`;
  }

  // 24-hour: "9:05" / "09:05" / "09:05:30"
  const twenty4 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twenty4) {
    const h = parseInt(twenty4[1], 10);
    const m = parseInt(twenty4[2], 10);
    if (h > 23 || m > 59) {
      throw new Error(`Time out of range: "${value}".`);
    }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  throw new Error(`Unrecognised time format: "${value}". Use HH:MM or HH:MM AM/PM.`);
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    // Populated by the pre-save hook; unique index prevents duplicate slugs
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    // Stored as YYYY-MM-DD after normalisation in the pre-save hook
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    // Stored as HH:MM (24-hour) after normalisation in the pre-save hook
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'] satisfies EventMode[],
        message: 'Mode must be one of: online, offline, hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Pre-save hook: slug generation + date/time normalisation
// ---------------------------------------------------------------------------

EventSchema.pre('save', async function () {
  // Regenerate slug only when the title is new or has been edited
  if (this.isModified('title')) {
    this.slug = slugify(this.title);
  }

  // Normalise date to YYYY-MM-DD; throws on unparseable input
  if (this.isModified('date')) {
    this.date = toISODate(this.date);
  }

  // Normalise time to HH:MM 24-hour; throws on unrecognised format
  if (this.isModified('time')) {
    this.time = toNormalisedTime(this.time);
  }
});

// ---------------------------------------------------------------------------
// Model (guard prevents recompilation on Next.js hot-reload)
// ---------------------------------------------------------------------------

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ??
  mongoose.model<IEvent>('Event', EventSchema);

export default Event;
