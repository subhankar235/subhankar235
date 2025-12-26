import Note from "../models/note.js";
import cloudinary from "../config/cloudinary.js";

/* =====================
   CREATE NOTE
===================== */
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const note = await Note.create({
    user: req.user.id,
    title,
    content
  });

  res.status(201).json(note);
};

/* =====================
   GET USER NOTES
===================== */
export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
};

/* =====================
   UPDATE NOTE
===================== */
export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  //Ownership check (MOST IMPORTANT 🔐)
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  //update this if any title provided or keep previous same as it is--
  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;


  const updatedNote = await note.save();
  res.json(updatedNote);
};

/* =====================
   DELETE NOTE
===================== */
export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
// Deletes a note ONLY if:

// The note exists
if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  //if  The logged-in user is the owner of that note

  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await note.deleteOne();
  res.json({ message: "Note deleted" });
};





/* =====================
   GET NOTES (SEARCH + PAGINATION)
===================== */
export const SearchNotes = async (req, res) => {
  try {
    // 1️⃣ read query params
    //MongoDB regex with "" matches everything
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    // 2️⃣ pagination math
    const skip = (page - 1) * limit;

    // 3️⃣ build search query
    const query = {
      user: req.user.id, // 🔐 only logged-in user
      $or: [

        //✅ Partial text match-regex
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ]
    };

    // 4️⃣ total count (for frontend pagination)
    const totalNotes = await Note.countDocuments(query);

    // 5️⃣ fetch notes-That line is what applies pagination to the search result.
    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 6️⃣ response
    res.json({
      page,
      limit,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      notes
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//image upload part--



export const uploadNoteImages = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // safety for old notes
    if (!note.images) {
      note.images = [];
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "notes"
      });

      note.images.push({
        url: result.secure_url,
        public_id: result.public_id
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id
      });
    }

    await note.save();

    res.json({
      message: "Images uploaded successfully",
      images: uploadedImages
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete images--
export const deleteNoteImage = async (req, res) => {
  try {
    const { noteId, publicId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(publicId);

    // remove from DB
    note.images = note.images.filter(
      (img) => img.public_id !== publicId
    );
//now save--
    await note.save();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//replace image--
export const replaceNoteImage = async (req, res) => {
  try {
    const { noteId, publicId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // delete old image
    await cloudinary.uploader.destroy(publicId);

    // upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "notes"
    });

    // replace in DB
    note.images = note.images.map((img) =>
      img.public_id === publicId
        ? {
            url: result.secure_url,
            public_id: result.public_id
          }
        : img
    );

    await note.save();

    res.json({
      message: "Image replaced",
      image: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




//upload banner--
export const uploadNoteBanner = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No banner image provided" });
    }

    // 🔴 delete old banner if exists
    if (note.bannerImage?.public_id) {
      await cloudinary.uploader.destroy(note.bannerImage.public_id);
    }

    // 🟢 upload new banner
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "note-banners"
    });

    // 💾 save banner in note
    note.bannerImage = {
      url: result.secure_url,
      public_id: result.public_id
    };

    await note.save();

    res.json({
      message: "Banner added / replaced successfully",
      banner: note.bannerImage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeNoteBanner = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.bannerImage?.public_id) {
      return res.status(400).json({ message: "No banner to remove" });
    }

    // 🔴 delete banner from Cloudinary
    await cloudinary.uploader.destroy(note.bannerImage.public_id);

    // 💾 remove from DB
    note.bannerImage = null;
    await note.save();

    res.json({ message: "Banner removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
