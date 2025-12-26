import Template from "../models/Template.js";
import Note from "../models/note.js";

/**
 * 🔹 YOU call this ONCE to add example templates
 * 🔹 createdBy = null → system template
 */
export const addExampleTemplate = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        message: "Title, category and content are required"
      });
    }

    const template = await Template.create({
      title,
      category,
      content,
      createdBy: null,   // 👈 example template
      isPaid: false,
      isPublished: true
    });

    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔹 USER: get templates for template bazaar
 * 🔹 system + seller templates together
 */
export const getTemplatesForUser = async (req, res) => {
  try {
    const categories = ["Planning", "Work", "Personal"];
    const result = {};

    for (const category of categories) {
      const templates = await Template.find({
        category,
        isPublished: true
      })
        .sort({ createdAt: -1 })
        .limit(4); // 👈 only 4 per category

      result[category] = templates;
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔹 USER: click "Use Template"
 * 🔹 Creates a NOTE from template
 */
export const useTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (template.isPaid) {
      return res.status(403).json({ message: "Paid template" });
    }
//ifg usable then creat the template and note copy this design
    const note = await Note.create({
      user: req.user.id,
      title: template.title,
      content: template.content // 🔥 COPY DESIGN
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
