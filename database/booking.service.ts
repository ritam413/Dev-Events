import mongoose from 'mongoose';
import Booking, { IBooking } from './booking.model';
import Event from './event.model';
import connectDB  from '../lib/mongodb';

/**
 * Creates a booking with transactional guarantees
 * 
 * This function ensures atomic consistency:
 * 1. Verifies the event exists
 * 2. Creates the booking
 * Both operations occur within a single MongoDB transaction, eliminating the
 * TOCTOU (Time-of-Check-Time-of-Use) race condition where an event could be
 * deleted between the existence check and the booking save.
 * 
 * @param eventId - ObjectId of the event
 * @param email - Email address for the booking
 * @returns The created booking document
 * @throws Error if event doesn't exist or booking creation fails
 */
export async function createBookingWithEventValidation(
  eventId: string | mongoose.Types.ObjectId,
  email: string
): Promise<IBooking> {
  // Ensure database connection
  await connectDB();

  // Start a session for transactional operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Convert eventId to ObjectId if it's a string
    const eventObjectId =
      typeof eventId === 'string' ? new mongoose.Types.ObjectId(eventId) : eventId;

    // 1. Check if event exists within the transaction
    const event = await Event.findOne({ _id: eventObjectId }).session(session);

    if (!event) {
      throw new Error(`Event with ID ${eventId} does not exist`);
    }

    // 2. Validate email
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    // 3. Create booking within the same transaction
    const booking = new Booking({
      eventId: eventObjectId,
      email: email.trim(),
    });

    await booking.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    return booking;
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    await session.endSession();
  }
}

/**
 * Finds a booking by event ID and email
 * 
 * @param eventId - ObjectId of the event
 * @param email - Email address
 * @returns Booking document or null
 */
export async function findBooking(
  eventId: string | mongoose.Types.ObjectId,
  email: string
) {
  await connectDB();

  const eventObjectId =
    typeof eventId === 'string' ? new mongoose.Types.ObjectId(eventId) : eventId;

  return Booking.findOne({
    eventId: eventObjectId,
    email: email.trim(),
  });
}

/**
 * Finds all bookings for a specific event
 * 
 * @param eventId - ObjectId of the event
 * @returns Array of booking documents
 */
export async function findBookingsByEvent(eventId: string | mongoose.Types.ObjectId) {
  await connectDB();

  const eventObjectId =
    typeof eventId === 'string' ? new mongoose.Types.ObjectId(eventId) : eventId;

  return Booking.find({ eventId: eventObjectId });
}
