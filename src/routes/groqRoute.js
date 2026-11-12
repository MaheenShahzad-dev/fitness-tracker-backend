let express=require('express');
let router=express.Router();
let groqController=require('../controllers/groqController')
let authMiddleware = require('../middleware/auth_middleware');
router.get('/groq-ai', authMiddleware.verifyToken,groqController.getGroq);





module.exports=router;