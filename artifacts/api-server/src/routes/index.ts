import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import patientsRouter from "./patients.js";
import crisesRouter from "./crises.js";
import medicationsRouter from "./medications.js";
import centersRouter from "./centers.js";
import geneticRouter from "./genetic.js";
import medicalRecordsRouter from "./medical-records.js";
import donorsRouter from "./donors.js";
import bloodRequestsRouter from "./blood-requests.js";
import pregnancyRouter from "./pregnancy.js";
import educationRouter from "./education.js";
import statsRouter from "./stats.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/patients", patientsRouter);
router.use("/crises", crisesRouter);
router.use("/medications", medicationsRouter);
router.use("/centers", centersRouter);
router.use("/genetic", geneticRouter);
router.use("/medical-records", medicalRecordsRouter);
router.use("/donors", donorsRouter);
router.use("/blood-requests", bloodRequestsRouter);
router.use("/pregnancies", pregnancyRouter);
router.use("/education", educationRouter);
router.use("/stats", statsRouter);

export default router;
