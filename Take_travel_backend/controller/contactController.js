const Contact = require("../model/contactModel");

// Create a new contact entry
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: "Contact form submitted successfully", contact });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contact messages
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
