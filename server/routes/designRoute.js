const express = require("express");
const router = express.Router();
const { 
  saveDesign, 
  getDesign, 
  getAllDesigns,
  deleteDesign // Add this import
} = require("../controllers/designController"); // Verify path is correct

const { protect } = require("../middlewares/authMiddleware");

// Apply protect middleware to all design routes
router.use(protect);

router.get("/", getAllDesigns);       // GET /api/designs
router.get("/:id", getDesign);        // GET /api/designs/:id
router.post("/", saveDesign);         // POST /api/designs
router.delete("/:id", deleteDesign); 


module.exports = router;