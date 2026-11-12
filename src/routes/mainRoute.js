let express=require('express');
let router=express.Router();
let authRoutes=require('./authRoute');
let groqRoutes=require('./groqRoute');
let userRoutes=require('./userRoute');
let workoutRoutes = require('./workoutRoute');
let nutritionRoutes = require('./nutritionRoute');
let progressRoutes = require('./progressRoute');
let reportRoutes = require('./reportRoute');
let notificationRoutes = require('./notificationRoute');
let goalRoutes = require('./goalRoute');
let dashboardRoutes = require('./dashboardRoute');
const utilityRoutes = require('./utilityRoute');












router.use('/auth',authRoutes);
router.use('/groq',groqRoutes);
router.use('/user',userRoutes);
router.use('/workouts', workoutRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/progress', progressRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/goals', goalRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/utility', utilityRoutes);




module.exports=router;