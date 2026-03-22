import { Event } from "@/database";
import { connectDB } from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        await connectDB();
        const formData = await req.formData();
        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error) {
            return NextResponse.json({message: 'Invalid JSON data format'}, {status: 400})
        }
        // get uploaded file
        const file = formData.get('image') as File;

        if(!file){
            return NextResponse.json({ message: 'File is required'}, {status: 400})
        };

        let tags = JSON.parse(formData.get('tags') as string)
        let agenda = JSON.parse(formData.get('agenda') as string)

        // if we get a file convert it to a buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, (error, results) => {
                if(error) return reject(error)
                resolve(results);

            }).end(buffer);
        });
        event.image = (uploadResult as { secure_url: string}).secure_url

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda
        });

        return NextResponse.json({message: 'Event created succefully', createdEvent},{ status: 201});

    } catch (err) {
       console.error(err)
       return NextResponse.json({message: 'Event Creation Failed', error: err instanceof Error ? err.message : err.message}, { status: 500}) 
    }
}

export async function GET(){
    try {
        await connectDB()

        const events = await Event.find().sort({ createdAt: -1});
        return NextResponse.json({ message: 'event fetched successfully', events }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: 'Event fetching failed', error: err }, { status: 500})
    }
}