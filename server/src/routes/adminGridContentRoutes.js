import { Router } from "express";
import { body, param } from "express-validator";
import {
  createGridContent,
  deleteGridContent,
  getAllGridContent,
  getSingleGridContent,
  updateGridContent
} from "../controllers/gridContentController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

const gridTypeValidator = body("gridType")
  .isIn(["loshu", "pythagoras", "vedic"])
  .withMessage("gridType must be one of: loshu, pythagoras, vedic");

const typeValidator = body("type")
  .isIn(["present", "missing"])
  .withMessage("type must be one of: present, missing");

const numbersValidator = body("numbers")
  .isArray({ min: 2 })
  .withMessage("Minimum 2 numbers required")
  .bail()
  .custom((arr) => {
    if (!Array.isArray(arr)) {
      throw new Error("Minimum 2 numbers required");
    }
    const nums = arr.map((n) => Number(n));
    const ok = nums.every((n) => Number.isInteger(n) && n >= 1 && n <= 9);
    if (!ok) {
      throw new Error("numbers must contain integers between 1 and 9");
    }
    const uniq = new Set(nums);
    if (uniq.size !== nums.length) {
      throw new Error("numbers must not contain duplicates");
    }
    if (uniq.size < 2) {
      throw new Error("Minimum 2 numbers required");
    }
    return true;
  })
  .customSanitizer((arr) => {
    const nums = arr.map((n) => Number(n));
    const uniq = Array.from(new Set(nums));
    uniq.sort((a, b) => a - b);
    return uniq;
  });

const htmlValidator = (field) =>
  body(field).optional({ values: "falsy" }).isString().withMessage(`${field} must be string`);

router.get("/grid-content", getAllGridContent);
router.get(
  "/grid-content/:id",
  [param("id").isMongoId().withMessage("Invalid id"), validateRequest],
  getSingleGridContent
);

router.post(
  "/grid-content",
  requireAdmin,
  [
    gridTypeValidator,
    typeValidator,
    numbersValidator,
    htmlValidator("englishContent"),
    htmlValidator("hindiContent"),
    validateRequest
  ],
  createGridContent
);

router.put(
  "/grid-content/:id",
  requireAdmin,
  [
    param("id").isMongoId().withMessage("Invalid id"),
    gridTypeValidator,
    typeValidator,
    numbersValidator,
    htmlValidator("englishContent"),
    htmlValidator("hindiContent"),
    validateRequest
  ],
  updateGridContent
);

router.delete(
  "/grid-content/:id",
  requireAdmin,
  [param("id").isMongoId().withMessage("Invalid id"), validateRequest],
  deleteGridContent
);

export default router;

