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

const numberValidator = body("number")
  .isInt({ min: 1, max: 9 })
  .withMessage("number must be between 1 and 9")
  .toInt();

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
  [gridTypeValidator, numberValidator, htmlValidator("englishContent"), htmlValidator("hindiContent"), validateRequest],
  createGridContent
);

router.put(
  "/grid-content/:id",
  requireAdmin,
  [
    param("id").isMongoId().withMessage("Invalid id"),
    gridTypeValidator,
    numberValidator,
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

