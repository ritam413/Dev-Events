'use server'

import { Event } from "@/database"
import connectToDatabase from "@/lib/mongodb"
import {NextResponse} from "next/server";


export const getSimilarEventsBySlug = async(slug:string)=>{
    try{
        await connectToDatabase()

        const event = await Event.findOne({slug:slug})

        if(!event){
            return []
        }

        return await Event.find({_id:{$ne:event._id},tags:{$in:event.tags}}).lean()
    }catch(error)
    {
        console.log('Failed to load Similar Event: ', error)
    }
}