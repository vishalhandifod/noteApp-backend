const Note = require('../models/Note');
const Tenant = require('../models/Tenant')
exports.createNote = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    // Get tenant info
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(403).json({ message: 'Tenant not found.' });

    // Enforce subscription limits
    if (tenant.subscriptionPlan === 'free') {
      const noteCount = await Note.countDocuments({ tenantId });
      if (noteCount >= 3) {
        return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro to add more notes.' });
      }
    }

    // Proceed with note creation
    const { title, content } = req.body;
    const userId = req.user.userId;

    if (!title) return res.status(400).json({ message: 'Title is required.' });

    const note = new Note({
      title,
      content,
      tenantId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
exports.getNotes = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const notes = await Note.find({ tenantId });
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const noteId = req.params.id;
    const note = await Note.findOne({ _id: noteId, tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const noteId = req.params.id;
    const { title, content } = req.body;
    const note = await Note.findOne({ _id: noteId, tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    note.updatedAt = new Date();

    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const noteId = req.params.id;
    const note = await Note.findOneAndDelete({ _id: noteId, tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json({ message: 'Note deleted.' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
