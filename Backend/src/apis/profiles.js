const { Router } = require('express');
const userAuth = require('../middleware/auth-guard');
const { userUpload } = require('../middleware/uploader.js');
const { User, Profile } = require('../models');

const { DOMAIN } = require('../constants/index.js');

const router = Router();

router.post('/api/create-profile', userAuth, userUpload.single("avatar"), async(req, res) =>{
    try{
        let { body, file, user } = req;

        // console.log("Uploaded file:", file);

        // if (!file) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'No avatar image uploaded.',
        //     });
        // }

        // let path = DOMAIN + file.path.split('uploads/')[1];
        let path = DOMAIN + "/" + file.filename;
        let profile = new Profile({
            social: body,
            account: user._id,
            avatar: path,
        });
        console.log("USER_PROFILE", profile);
        await profile.save();
        return res.json({
            message: "Profile created successfully."
        })
    } catch (err) {
        // console.log(err);
        return res.status(400).json({
            success:false,
            message:"Unable to create profile."
        })
    }
});

router.get('/api/my-profile', userAuth, async (req, res) => {
    try{
        let profile = await Profile.findOne({ account: req.user._id }).populate(
            "account",
            "name email username"
        );
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "your profile is not available.",
            });
        }
        return res.status(200).json({
            success: true,
            profile,
        });
    } catch(err) {
        return res.status(400).json({
            success: false,
            message: "Unable to get profile.",
        });
    }
});


router.put('/api/update-profile', userAuth, userUpload.single("avatar"), async (req, res) => {
    try{
       let { body, file, user } = req;
       let path = DOMAIN + "/" + file.filename;
       let profile = await Profile.findOneAndUpdate({account: req.user._id}, { social: body, avatar: path }, {new: true});
       if(!profile){
          return res.status(404).json({
            success: false,
            message: "Your profile is not available."
          });
       }
       return res.status(200).json({
        success: true,
        message:"Your profile is updated.",
        profile,
       })

    } catch(err) {
        return res.status(400).json({
            success: false,
            message: "Unable to get profile.",
        });
    }
});

router.get('/api/profile-user/:username', async (req, res) => {
    try{
        let { username } = req.params;
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        let profile = await Profile.findOne({ account: user._id });
        return res.status(200).json({
            profile:{
                ...profile.toObject(),
                account: user.getUserInfo(),
            },
            success: true,
        });
    } catch(err) {
        return res.status(400).json({
            success: false,
            message: "Unable to get user.",
        });
    }
});

module.exports = router;