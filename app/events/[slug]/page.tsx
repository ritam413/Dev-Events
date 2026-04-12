import { notFound } from 'next/navigation';
import Image from 'next/image';
import BookEvent from '@/app/components/BookEvent';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => {
  return (
    <div className='flex-row-gap-2 items-center'>
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  )
}


const EventAgenda = async ({agendaItems}:{agendaItems:string[]}) => (
  <div className='agenda'>
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item:string)=>(
        <li  key={item}>
          {item}
        </li>
      ))}
    </ul>
  </div>
)
const EventDetailspage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  console.log("slug", slug)

  const request = await fetch(`${BASE_URL}/api/events/${slug}`)
  const { data: event } = await request.json()

  if (!event) return notFound()


  const bookings = 0;

  console.log("event ✅" )
  return (
    <section id='event'>

      <div className='header'>
        <h1>{event.title}</h1>
        <h2>Event Description</h2>
        <p>{event.description}</p>
      </div>

      <div className='details'>
        <div className='content'>
          <Image src={event.image} alt="Event Banner" width={800} height={800} className='banner' />

          <section className='flex-col-gap-2'>
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className='flex-col-gap-2'>
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="Calendar Icon" label={event.date} />
            <EventDetailItem icon="/icons/pin.svg" alt="Location Icon" label={event.location} />
            <EventDetailItem icon="/icons/clock.svg" alt="Clock Icon" label={event.time} />
          </section>

          <EventAgenda agendaItems={JSON.parse(event.agenda)} />

          <section className='flex-col-gap-2'>
            <h2> About The Organizers </h2>
            <p>{event.organizer}</p>
          </section>


        </div>

        <aside className='booking'>
          <div className='signup-card'>
            <h2>
              Book Your Spot Now!
            </h2>
            {bookings>0?(
              <p>
                Join {bookings} others who have already booked their spot for this event. Don't miss out on an unforgettable experience!
              </p>
            ):(
              <p>
                Be the first to book your spot for this exciting event! 
              </p>
            )}

            <BookEvent/>
          </div>
      </aside>
      </div>

      
    </section >
  )
}

export default EventDetailspage
