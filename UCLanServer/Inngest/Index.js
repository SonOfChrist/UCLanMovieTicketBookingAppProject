import { Inngest } from "inngest";
import User from "../Models/User.js";

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

export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation
];