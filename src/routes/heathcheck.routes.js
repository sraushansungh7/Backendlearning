import { Router } from "express";
import { heathchec } from "../controllers/healthcheck.js";

const router=Router();
router.route('/').get(heathchec);



export default router;