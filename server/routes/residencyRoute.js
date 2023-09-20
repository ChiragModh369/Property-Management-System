import express from "express";
import { createResidency, deleteResidency, getAddedResidencies, getAllResidencies, getResidency } from "../controllers/resdCntrl.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();

router.post("/create", jwtCheck, createResidency) // to create a new residency
router.get("/allresd", getAllResidencies) // to get all Residency
router.get("/addedresd/:email", getAddedResidencies) // to get added residency by user
router.get("/:id", getResidency) //to get only specific residency
router.delete("/delResd/:id", jwtCheck, deleteResidency) //to delete Residency

export { router as residencyRoute }