import { IEvent } from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";


type RouteParams = {
    params:Promise<{
        slug:string
    }>
}

export async function GET(
    req:NextRequest,
   context: { params: Promise<{ slug: string }> }
) {
    const resolvedParams = await context.params
    const slug =  resolvedParams.slug
    if(
        typeof(slug) !== 'string' ||
        slug === ""||
        slug.length > 100 
    ) return NextResponse.json({success:false,message:'Undefined slug'},{status:400})
    console.log("slug: ✅");


    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    const isValid = slugRegex.test(slug as string)

    if(!isValid) return NextResponse.json({success:false,message:'Invalid slug'},{status:400})

    try {
        await connectToDatabase()

        const event = await Event.findOne({slug:slug})

        if(!event) return NextResponse.json({success:false,message:'Event not found'},{status:404})

        return NextResponse.json({success:true,message:'Event Fetched Successfully',data:event},{status:200} )
    } catch (error) {
        return NextResponse.json({success:false,message:'Event Fetch Failed',error:error instanceof Error?error.message:'Unknown Error'},{status:500})
    }
}