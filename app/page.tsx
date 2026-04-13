import Explorebtn from "./components/Explore_btn";
import EventCard from "./components/EventCard";
import {events} from "../lib/constatnts";
import { IEvent } from "@/database/event.model";
import {cacheLife} from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' 

export default async function Home() {
  'use cache'
  cacheLife('days')
  const response = await fetch(`${BASE_URL}/api/events`,{
    method:'GET',
    headers:{
      'Content-Type':'application/json'
    },
    next:{tags:['events']}
  })

  const {events : fetchedEvents} = await response.json()

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
          {fetchedEvents.map((event:IEvent)=>(
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
