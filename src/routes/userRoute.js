let express=require('express');
let router=express.Router();
let userController=require('../controllers/userController');
let authMiddleware=require('../middleware/auth_middleware');
const upload = require('../middleware/upload');


router.get('/profile',authMiddleware.verifyToken,userController.getProfile);
router.put('/profile',authMiddleware.verifyToken,userController.updateProfile);
router.post('/Notification',authMiddleware.verifyToken,userController.updateNotificationSettings);

router.put('/profile-pic',authMiddleware.verifyToken,   upload.single('profilePic'),userController.updateProfilePic);




module.exports=router;