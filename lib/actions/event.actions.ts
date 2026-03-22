'use server';

import { Event } from "@/database/";
import { connectDB } from "../mongodb";

export const getSimilarEventsByslug = async (slug: string) => {
    try {
        await connectDB(); // must be awaited before any queries run
        const event = await Event.findOne({ slug }).lean();
        if (!event) return [];
        // .lean() returns plain objects — safe to spread and serialise in Server Components
        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return [];
    }
}
