const express = require("express");
const { createContact, getContacts } = require("../controller/contactController");

const router = express.Router();

router.post("/contact", createContact);  // Submit form
router.get("/contacts", getContacts);   // Fetch all messages

module.exports = router;
