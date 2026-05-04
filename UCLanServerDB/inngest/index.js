import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "UCLanMovieTicketBookingApp" });

// Inngest functions to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
    async ({ event }) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        };
        await User.create(userData);
    }
);

// Inngest functions to handle user deletion
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event }) => {
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
);

// Inngest functions to Update user data in database
const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
    async ({ event }) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
);

// Inngest function to cancel bookings and release seats  of show after 10minutes of booking creation if the booking is not paid. This function will be triggered by a scheduled event.
const releaseSeatsAfterUnpaid = inngest.createFunction(
    {id: "release-seats-after-unpaid", triggers: [{ event: "app/checkpayment" }]},
    async ({event, step}) => {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        await step.sleepUntil('wait-for-ten-minutes', tenMinutesAgo);
        await step.run("check-unpaid-bookings", async () => {
            const bookingId = event.data.bookingId;
            const bookingData = await Booking.findById(bookingId).populate('show');
            // If booking not is already paid, release the seats and delete the booking
            if(!bookingData.isPaid){
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(bookingId);
            }
        })
    }
)


export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAfterUnpaid
];