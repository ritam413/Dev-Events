import Image from "next/image";
import Explorebtn from "./components/Explore_btn";
import EventCard from "./components/EventCard";
import {events} from "../lib/constatnts";
const events8 = [
  { image:'/images/event1.png',
    title:'Event 1 ',
    slug:'event-1',
    location:'location-1',
    date:'Date-1',
    time:'Time-1'
  },
  {image:'/images/event2.png',title:'Event 2 ',
     slug:'event-1',
    location:'location-1',
    date:'Date-1',
    time:'Time-1'
  },
  {image:'/images/event3.png',title:'Event 3 ',
     slug:'event-1',
    location:'location-1',
    date:'Date-1',
    time:'Time-1'
  },
]

export default function Home() {
  return (
    <>
    <section className="text-center">
      <h1>
      The Hub For Every Dev <br /> Even't you Can't Miss
      </h1>      
      <p className="text-center mt-5"> Hackathons,Meeting and Conferences. All in one Place</p>

      <Explorebtn/>

      <div className="mt-10 space-y-7 text-start">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event)=>(
            <li className='list-none' key={event.title}>
              <EventCard {...event}/>
            </li>
          ))}
        </ul>

      </div>

    </section>
    </>
  );
}
