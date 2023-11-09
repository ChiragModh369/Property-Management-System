import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"

export const createUser = asyncHandler(async (req, res) => {
    // console.log("Creating a user");

    let { email, name } = req.body;
    const userExist = await prisma.user.findUnique({ where: { email: email } })

    if (!userExist) {
        const user = await prisma.user.create({ data: req.body })
        res.send({
            message: "User Registered Successfully",
            user: user
        })
    }
    else {
        res.status(201).send({ message: "User already registered" })
    }

});

// Function to book a visit to residency
export const bookVisit = asyncHandler(async (req, res) => {

    const { email, date } = req.body
    const { id } = req.params

    try {

        const alreadyBooked = await prisma.User.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
            res.status(400).send({ message: "This residency is already booked by you" })
        }
        else {
            await prisma.user.update({
                where: { email: email },
                data: {
                    bookedVisits: { push: { id, date } }
                }
            })
            res.send("Your visit has been booked successfully")
        }
    } catch (err) {
        throw new Error(err.message)
    }

})


// Function to get All the bookings of a user

export const getallBookings = asyncHandler(async (req, res) => {
    const { email } = req.body

    try {

        const bookings = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })
        res.status(200).send(bookings)
    } catch (err) {
        throw new Error(err.message)
    }
})

// Function to cancel a booking

export const cancelBooking = asyncHandler(async (req, res) => {

    const { email } = req.body
    const { id } = req.params

    try {

        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        const index = user.bookedVisits.findIndex((visit) => visit.id === id)

        if (index === -1) {
            res.status(404).json({ message: "Booking Not Found" })
        }
        else {
            user.bookedVisits.splice(index, 1)

            await prisma.user.update({
                where: { email: email },
                data: {
                    bookedVisits: user.bookedVisits
                }
            })
            res.send("Booing Cancelled Successfully")
        }

    } catch (err) {
        throw new Error(err.message)
    }

})

// Add residencies as favourite

export const toFav = asyncHandler(async (req, res) => {

    const { email } = req.body
    const { rid } = req.params

    try {

        const user = await prisma.user.findUnique({
            where: { email: email },
        })

        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where: { email: email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    }
                }
            })
            res.send({ message: "Removed from Favourites", users: updateUser })
        }
        else {
            const updateUser = await prisma.user.update({
                where: { email: email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            })
            res.send({ message: "Updated Favourites", users: updateUser })
        }

    } catch (err) {
        throw new Error(err.message)
    }

})

// Function to get all favourites

export const getAllFavourites = asyncHandler(async (req, res) => {
    const { email } = req.body

    try {

        const favResd = await prisma.user.findUnique({
            where: { email: email },
            select: { favResidenciesID: true }
        })
        res.status(200).send(favResd)
    } catch (err) {
        throw new Error(err.message)
    }
})
