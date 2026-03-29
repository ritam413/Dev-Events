/**
 * Database Models Index
 * 
 * Centralized export point for all Mongoose models and services.
 * Import models from this file: `import { Event, Booking } from '@/database'`
 * Import services: `import { createBookingWithEventValidation } from '@/database'`
 */

export { default as Event } from './event.model';
export { default as Booking } from './booking.model';
export {
  createBookingWithEventValidation,
  findBooking,
  findBookingsByEvent,
} from './booking.service';
