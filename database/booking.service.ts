import mongoose from 'mongoose';
import Booking, { IBooking } from './booking.model';
import Event from './event.model';
import connectDB  from '../lib/mongodb';


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
    let eventObjectId;
    if(typeof eventId === 'string')
      eventObjectId = new mongoose.Types.ObjectId(eventId);
    else
      eventObjectId = eventId;
    

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

    await session.abortTransaction();
    throw error;
  } finally {
  
    await session.endSession();
  }
}


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

export async function findBookingsByEvent(eventId: string | mongoose.Types.ObjectId) {
  await connectDB();

  const eventObjectId =
    typeof eventId === 'string' ? new mongoose.Types.ObjectId(eventId) : eventId;

  return Booking.find({ eventId: eventObjectId });
}
