import mongoose, { Schema, Document, Types } from 'mongoose';
import Event from './event.model';

/**
 * Booking Document Interface - Defines the structure of a Booking document
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema Definition
 */
const BookingSchema: Schema<IBooking> = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries on eventId
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      validate: {
        validator: (email: string) => {
          // RFC 5322 compliant email regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook: Validates event existence and email format
 * Mongoose 9.x: throws errors instead of calling next(err)
 */
BookingSchema.pre<IBooking>('save', async function () {
  // Validate email format via schema validation, additional check for empty
  if (!this.email || this.email.trim().length === 0) {
    throw new Error('Email cannot be empty');
  }

  // Verify that the referenced event exists - prevents orphaned bookings
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error(`Event with ID ${this.eventId} does not exist`);
  }
});

/**
 * Booking Model - Singleton pattern to prevent model recompilation
 */
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
