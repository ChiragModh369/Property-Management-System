import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"
// const moment = import('moment-timezone');
// const currentTimeInNewTimeZone = moment().tz('Asia/Kolkata');
export const createResidency = asyncHandler(async (req, res) => {
    const { title, description, price, address, country, city, facilities, image, userEmail } = req.body.data

    try {

        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                country,
                city,
                facilities,
                image,
                owner: { connect: { email: userEmail } },
            }
        })
        res.send({ message: "Residency created successfully", residency })

    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("A residency with this address already exist")
        }
        throw new Error(err.message)
    }
})

// Function to Update the Residency
export const updateResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, address, country, city, facilities, image } = req.body

    try {
        const residency = await prisma.residency.update({
            where: {
                id
            },
            data: {
                title,
                description,
                price,
                address,
                city,
                country,
                image,
                facilities
            }
        });

        if (!residency) {
            return res.status(404).send({ message: "Residency not found" });
        }

        res.send({ message: "Residency updated successfully", residency });
    } catch (error) {
        console.error('Error updating Residency:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Fuction to get all the residencies
export const getAllResidencies = asyncHandler(async (req, res) => {

    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.send(residencies)

})

// function to get a specific residency

export const getResidency = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const residency = await prisma.residency.findUnique({
            where: { id: id }
        })
        res.send(residency)
    } catch (err) {
        throw new Error(err.message)
    }
})

//  function to get Added Residency

export const getAddedResidencies = asyncHandler(async (req, res) => {

    const { email } = req.params

    try {
        const AddedResideincies = await prisma.residency.findMany({
            where: { userEmail: email }
        })
        res.send(AddedResideincies)

    } catch (err) {
        throw new Error(err.message)
    }

})

// Function to Delete Residency

export const deleteResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const removeResd = await prisma.residency.delete({
            where: { id: id }
        })
        res.send("Residency Deleted Successfully")
    } catch (err) {
        throw new Error(err.message);
    }
})