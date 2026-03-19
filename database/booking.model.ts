import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Lightweight RFC 5322-inspired email regex.
 * Validates that the address has the form local@domain.tld with no whitespace.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const BookingSchema = new Schema<IBooking>(
  {
    // Indexed for fast lookups by event; references the Event collection
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,  // normalise to lowercase before saving
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: 'Please provide a valid email address',
      },
    },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Pre-save hook: verify the referenced Event exists before creating a booking
// ---------------------------------------------------------------------------

BookingSchema.pre('save', async function () {
  // Only run the DB lookup when eventId is first set or explicitly changed
  if (!this.isModified('eventId')) return;

  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error(
      `Cannot create booking: Event with ID "${this.eventId}" does not exist.`
    );
  }
});

// ---------------------------------------------------------------------------
// Model (guard prevents recompilation on Next.js hot-reload)
// ---------------------------------------------------------------------------

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ??
  mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
