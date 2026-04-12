import mongoose, { Schema, Document } from 'mongoose';

/**
 * Event Document Interface - Defines the structure of an Event document
 */
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
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Schema Definition
 */
const EventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
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
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      trim: true,
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
        validator: (agenda: string[]) => agenda.length > 0,
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
        validator: (tags: string[]) => tags.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Unique index on slug for fast lookups and uniqueness enforcement
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook: Generates URL-friendly slug from title, normalizes date/time
 * Mongoose 9.x: throws errors instead of calling next(err)
 */
EventSchema.pre<IEvent>('save', function () {
  // Generate slug only if title is modified or slug doesn't exist
  // Normalize time to HH:MM format (24-hour)
   if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  if (this.isModified('time') && this.time) {
    const timeMatch = this.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2]);
      const meridiem = timeMatch[3]?.toUpperCase();

      // Validate hour range
      if (meridiem) {
        if (hours > 12 || hours < 1) {
          throw new Error('Invalid hour');
        }
      } else {
        if (hours > 23 || hours < 0) {
          throw new Error('Invalid hour');
        }
      }

      // Validate minute range
      if (minutes > 59 || minutes < 0) {
        throw new Error('Invalid minute');
      }

      // Perform AM/PM adjustments if meridiem is present
      if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'AM' && hours === 12) {
        hours = 0;
      }

      // Set this.time to a zero-padded HH:MM string
      this.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  // Normalize date to ISO format if it contains valid date data
  if (this.isModified('date') && this.date) {
    const parsedDate = new Date(this.date);
    if (!isNaN(parsedDate.getTime())) {
      this.date = parsedDate.toISOString().split('T')[0]; // Store as YYYY-MM-DD
    }
  }

  // Normalize time to HH:MM format (24-hour)
  if (this.isModified('time') && this.time) {
    const timeMatch = this.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3]?.toUpperCase();

      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      this.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  // Validate required fields are non-empty
  const requiredStringFields: (keyof IEvent)[] = [
    'title', 'description', 'overview', 'image', 'venue',
    'location', 'date', 'time', 'mode', 'audience', 'organizer'
  ];

  for (const field of requiredStringFields) {
    const value = this[field] as unknown as string;
    if (typeof value === 'string' && value.trim().length === 0) {
      throw new Error(`${field} cannot be empty`);
    }
  }

  // Validate array fields are non-empty
  if (!this.agenda || this.agenda.length === 0) {
    throw new Error('Agenda must contain at least one item');
  }

  if (!this.tags || this.tags.length === 0) {
    throw new Error('Tags must contain at least one item');
  }
});

/**
 * Event Model - Singleton pattern to prevent model recompilation
 */
const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
