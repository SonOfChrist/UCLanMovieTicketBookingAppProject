import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

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
        const tenMinutesAgo = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-ten-minutes', tenMinutesAgo);
        await step.run("check-unpaid-bookings", async () => {
            const bookingId = event.data.bookingId;
            const bookingData = await Booking.findById(bookingId);
            // If booking not is already paid, release the seats and delete the booking
            if(!booking.isPaid){
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(booking._Id);
            }
        })
    }
)

// Inngest function to send an email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email", triggers: [{ event: "app/booking.created" }] },
    async ({ event, step }) => {
        const { bookingId } = event.data;
       
        const booking= await Booking.findById(bookingId).populate({
            path: 'show',
            populate: {
                path: 'movie',
                model: 'Movie'
            }
        }).populate('user');
        await sendEmail({
            to: booking.user.email,
            subject: `Booking Confirmation: "${booking.show.movie.title} Booked Successfully!"`,
            body: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #007BFF;">Hi ${booking.user.name}</h2>
                <p>Your booking for <strong style="color: #007BFF;">${booking.show.movie.title}</strong>is confirmed.</p>
                <p>
                    <strong>Date</strong> ${new Date(booking.show.showDateTime).toLocaleString('en-US', { timeZone: 'UTC' })}<br>
                    <strong>Time</strong> ${new Date(booking.show.showDateTime).toLocaleString('en-US', { timeZone: 'UTC' })}<br>
                </p>
                <p>Enjoy the show! 🎬🍿</p>
                <p>Thanks for Booking with us! <br/>UCLanMovie Team</p>
            </div>`
        })
    }
);

// inngest functions to send Reminders
const sendBookingReminderEmail = inngest.createFunction(
    { id: "send-booking-reminder-email", triggers: [{ cron: "0 */8 * * *" }] },
    async ({ step }) => {
        const now = new Date();
        const eightHoursLater = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(eightHoursLater.getTime() - 10 * 60 * 1000);

        // Prepare Reminder Task
        const reminderTask = await step.run
        ("prepare-reminder-tasks", async () => {
            const shows = await Show.find({ 
                showTime: { $gte: windowStart, $lte: eightHoursLater },
             }).populate('movie');
             const tasks = [];

             for(const show of shows){
                if(!show.movie || !show.occupiedSeats) continue;
                const occupiedSeats = Object.keys(show.occupiedSeats);
                const userIds = [...new Set(Object.values(show.occupiedSeats))];
                if(userIds.length === 0) continue;
                const users = await User.find({_id: {$in: userIds}}).select('name email');
                for(const user of users){
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showTime
                    })
                }

            }
            return tasks;
        })
        if(reminderTask.length === 0){
            return {sent: 0, message: "No reminders to send at this time."}
        }
        // send reminder emails
        const results = await step.run("send-reminder-emails", async () => {
            return await Promise.allSettled(
                reminderTask.map((task) => sendEmail({
                    to: task.userEmail,
                    subject: `Reminder: ${task.movieTitle} is coming up!`,
                    body: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                        <h2 style="color: #007BFF;">Hi ${task.userName}</h2>
                        <p>This is a friendly reminder that your booking for <strong style="color: #007BFF;">${task.movieTitle}</strong> is scheduled for <strong>${new Date(task.showTime).toLocaleString('en-US', { timeZone: 'UTC' })}</strong>.</p>
                        <p>Enjoy the show! 🎬🍿</p>
                        <p>Thanks for Booking with us! <br/>UCLanMovie Team</p>
                    </div>`
                }))
            )
        })
        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.filter.length -sent;
        return {
            sent,
            failed, 
            message: `Sent: ${sent} reminder(s), Failed: ${failed} failed.`
        }
    }
)

// Send a new show Notification email to users
const sendNewShowNotification = inngest.createFunction(
    { id: "send-new-show-notification", triggers: [{ event: "app/show.added" }] },
    async ({ event }) => {
        const { movieTitle, movieId } = event.data;
        const users = await User.find({})
        for(const user of users){
            const userEmail = user.email;
            const userName = user.name;
            const subject = `New Movie Alert: ${movieTitle} is now available for booking!`;
            const body = `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #007BFF;">Hi ${userName}</h2>
                <p> We have just added a new movie to our lineup!</p>
                <p>We are excited to announce that a new movie <strong style="color: #007BFF;">${movieTitle}</strong> is now available for booking on our platform.</p>
                <p>Don't miss out on the chance to watch this amazing movie. Book your tickets now! 🎬🍿</p>
                <a href="${process.env.CLIENT_URL}/movies/${movieId}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Book Now</a>
                <p>Thanks for being a valued member of our community! <br/>UCLanMovie Team</p>
            </div>`;
            await sendEmail({
                to: userEmail, 
                subject, 
                body
            })
        }
        return {message: "Notification Sent"}
    }
)

export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAfterUnpaid,
    sendBookingConfirmationEmail,
    sendBookingReminderEmail,
    sendNewShowNotification
];