import { Router } from "express";
import { body } from "express-validator";
import { getHistory, postCalculate } from "../controllers/numerologyController.js";

const router = Router();
const DOB_REGEX = /^\d{2}-\d{2}-\d{4}$/;

const isValidDob = (value) => {
  if (!DOB_REGEX.test(value)) {
    return false;
  }

  const [day, month, year] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

router.post(
  "/calculate",
  [
    body("fullName")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Full name must be between 2 and 80 characters."),
    body("dateOfBirth")
      .trim()
      .custom((value) => isValidDob(value))
      .withMessage("Date of birth must be a valid date in DD-MM-YYYY format."),
    body("mobileNumber")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Mobile number must be exactly 10 digits."),
    body("saveHistory").optional().isBoolean().withMessage("saveHistory must be boolean.")
  ],
  postCalculate
);

router.get("/history", getHistory);

export default router;
