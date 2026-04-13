'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import posthog from 'posthog-js'

interface Props {
    title: string,
    image: string,
    time: string,
    date: string,
    location: string,
    slug: string,
}

const EventCard = ({ title, image, time, date, location, slug }: Props) => {
    return (
        <Link href={`/events/${slug}`} id='event-card' onClick={() => posthog.capture('event_card_clicked', { title, slug, location })}>
            <Image 
            src={image} 
            alt={title} 
            width={410} 
            height={300} 
            className='poster' 
             style={{ width: "auto", height: "auto" }}
            />
            <div className='flex flex-row gap-2'>
                <Image src='/icons/pin.svg' alt='location' width={14} height={14}  style={{ width: "auto", height: "auto" }}/>
                <p>{location}</p>
            </div>
            <p className='title'>{title}</p>
            <div className='datetime'>
                <div>
                    <Image src='/icons/calendar.svg' alt='date' width={14}  height={14}   style={{ width: "auto", height: "auto" }}/>
                    <p>{date}</p>
                </div>
                <div>
                    <Image src='/icons/clock.svg' alt='clock' width={14} height={14}  style={{ width: "auto", height: "auto" }}/>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard
