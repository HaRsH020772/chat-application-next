const express = require('express');
const router = express.Router();
const {saveUserDetails, verifyUserDetails, setTheUserAvatar, getAllTheUsers, addMessage, getAllMessage} = require('../controller/userController');

router.route('/user-signup').post(saveUserDetails);
router.route('/user-login').post(verifyUserDetails);
router.route('/avatar-setup').put(setTheUserAvatar);

router.route('/users-list/:id').get(getAllTheUsers);

router.route('/add-msg').post(addMessage);
router.route('/get-msg').post(getAllMessage);

module.exports = router;