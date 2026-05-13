import mongoose from 'mongoose';
import Event from './models/eventModel.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const newEvent = await Event.create({
      title: "Test Event",
      description: "This is a test event to verify if creation works correctly without therapistName.",
      eventDate: new Date(),
      durationMinutes: 60,
      location: "Online",
      mode: "online",
      category: "workshop",
      status: "published",
    });
    console.log("Event created successfully:", newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
  } finally {
    mongoose.disconnect();
  }
});
