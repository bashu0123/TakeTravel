const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find(); // Fetch all users

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getAllGuides = catchAsync(async (req, res, next) => {
    const users = await User.find({ role: "guide", verified: true });

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});




exports.getUser = catchAsync(async (req,res,next)=>{
    let doc =  await User.findById(req.user.id);

    if(!doc){
        return res.status(404).json({
            status: 'fail',
            message: 'no document found with that id'
        });
    } 
    // console.log('this one is also being called')
    res.status(200).json({
        status:'sucess',
        data:{
            doc
        }
    })
})
exports.approveGuide = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'No user found with that ID'
        });
    }

    if (user.role !== 'guide') {
        return res.status(400).json({
            status: 'fail',
            message: 'This user is not a guide'
        });
    }

    user.verified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Guide approved successfully',
        data: {
            user
        }
    });
});

exports.rejectGuide = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'No user found with that ID'
        });
    }

    if (user.role !== 'guide') {
        return res.status(400).json({
            status: 'fail',
            message: 'This user is not a guide'
        });
    }

    // Instead of deleting, set active to false
    user.active = false;
    await user.save({ validateBeforeSave: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});