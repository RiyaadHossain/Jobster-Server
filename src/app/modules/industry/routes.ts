import express from "express"
import { IndustryControllers } from "./controller";
const router = express.Router()

router.get('/job-openings', IndustryControllers.jobOpenings)

export const IndustryRoutes = router;