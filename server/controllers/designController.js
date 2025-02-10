const Design = require('../models/designModel');

// Save Design (add protect middleware)
exports.saveDesign = async (req, res) => {
    try {
        console.log('[SAVE] Request body:', req.body);
        console.log('[SAVE] Authenticated user:', req.user);
        const { name, data } = req.body;
        
        if (!name?.trim()) {
            return res.status(400).json({ message: 'Design name is required' });
        }

        const newDesign = new Design({ 
            name: name.trim(), 
            data,
            user: req.user.email
        });
        
        await newDesign.save();
        res.status(201).json({ message: 'Design saved successfully', design: newDesign });
    } catch (error) {
        console.error('[SAVE] Critical Error:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            user: req.user
        });
        res.status(500).json({ 
            message: 'Error saving design',
            error: error.message // Safer than sending full error object
        });
    }
};

// Get All Designs for Logged-in User
exports.getAllDesigns = async (req, res) => {
    try {
        const designs = await Design.find({ user: req.user.email });
        res.status(200).json(designs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching designs', error });
    }
};

// Get Single Design (with ownership check)
exports.getDesign = async (req, res) => {
    try {
        const design = await Design.findOne({
            _id: req.params.id,
            user: req.user.email
          });

        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }
        
        res.status(200).json(design);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving design', error });
    }
};

exports.deleteDesign = async (req, res) => {
    try {
      const design = await Design.findOneAndDelete({
        _id: req.params.id,
        user: req.user.email
      });
      const deletedDesign = await Design.findById(req.params.id);
      console.log("Deleted design from DB:", deletedDesign); // Should be null if deleted
    
      if (!design) {
        return res.status(404).json({ message: 'Design not found' });
      }

    
      res.status(200).json({ 
        message: 'Design deleted successfully',
        deletedDesign: design
      });
      
    } catch (error) {
      res.status(500).json({ 
        message: 'Error deleting design',
        error: error.message
      });
    }
  };