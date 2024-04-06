import { Router } from "express";
import { uploadFile } from "../controllers/transactions.controller";
import multer from "multer";

export const router = Router();
const upload = multer({ dest: "tmp/csv/" });

router.post("/", upload.single("transactions"), uploadFile);

export default router;
