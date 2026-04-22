import { Router } from "express";
import { body } from "express-validator";
import { getHistory, postCalculate } from "../controllers/numerologyController.js";

const router = Router();

router.post(
  "/calculate",
  [
    body("fullName")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Full name must be between 2 and 80 characters."),
    body("dateOfBirth")
      .isISO8601()
      .withMessage("Date of birth must be a valid date (YYYY-MM-DD)."),
    body("gender")
      .optional({ values: "falsy" })
      .isIn(["male", "female", "non-binary", "prefer_not_to_say"])
      .withMessage("Gender value is not supported."),
    body("saveHistory").optional().isBoolean().withMessage("saveHistory must be boolean.")
  ],
  postCalculate
);

router.get("/history", getHistory);

export default router;
