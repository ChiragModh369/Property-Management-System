import express from "express";
import { createResidency, deleteResidency, getAddedResidencies, getAllResidencies, getResidency } from "../controllers/resdCntrl.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();

router.post("/create", jwtCheck, createResidency)
router.get("/allresd", getAllResidencies)
router.get("/addedresd/:email", getAddedResidencies)
router.get("/:id", getResidency) //to get only specific residency
router.delete("/delResd/:id", deleteResidency)

export { router as residencyRoute }