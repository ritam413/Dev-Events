import { v2 as cloudinary} from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";
import {revalidateTag} from "next/cache";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_URL,
//     // api_key: process.env.CLOUDINARY_API_KEY,
//     // api_secret: process.env.CLOUDINARY_API_SECRET
// })

export async function POST(req:NextRequest) {
    try {
        await connectToDatabase();

        const formData = await req.formData();

        let event ;

        try{
            event = Object.fromEntries(formData.entries())
        }catch(e){
            return NextResponse.json({message:'Invalid JSON Format data'},{status:400})
        }
        
        const file = formData.get('image')as File

        if(!file){
            return NextResponse.json({message:'Image is required'},{status:400})
        }

        let tags:string[];
        let agenda :string[];

        try{
            tags = JSON.parse(formData.get('tags') as string)
            agenda =  JSON.parse(formData.get('agenda') as string)
        }catch{
            return NextResponse.json({message:'Invalid Tags/Agenda format data'},{status:400})
        }

        if(!Array.isArray(tags)|| !Array.isArray(agenda)){
            return NextResponse.json({message:'Tags and agenda are not in array format'})
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:'image',folder:'DevEvents'},(error,result)=>{
                if(error) return reject(error)
                
                resolve(result)
            }).end(buffer)
        });
        // see this part
        event.image = (uploadResult as {secure_url : string}).secure_url

        const createdEvent = await Event.create({
            ...event,
            tags:tags,
            agenda:agenda,
        });

        revalidateTag('events')


        return NextResponse.json({message:'Event Created Successfully',event:createdEvent},{status:201})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message:'Event Creation Failed',error:e instanceof Error?e.message:'Unknown Error'},{status:500})
    }
}

export async function GET(req:NextRequest){
    try {
        await connectToDatabase()

        const events = await Event.find().sort({createdAt:-1})

        return NextResponse.json({message:'Events Fetched Successfully',events},{status:200})

    } catch (error) {
        return NextResponse.json({message:'Event Fetch Failed',error:error instanceof Error?error.message:'Unknown Error'},{status:500})
    }
}

// a route that accepts a slug as input -> returns the event details 
