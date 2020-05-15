const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const { MakeResponse } = require('../../utils/APIStatus.js');
const userAction = require('../../action/user.js');

const User = require('../../models/User');
const Account = require('../../models/Account');

router.post('/', [
  check('full_name', 'Full name is required').not().notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('balance', 'Please enter a balance with 0 or more').isInt({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }

  const {
    fullName,
    email,
    phoneNumber,
    password,
    role,
    balance,
  } = req.body;
  const accountType = 'DEFAULT';
  const accountId = '1612556';

  try {
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        errors: [{
          msg: 'User already exists',
        }],
      });
    }

    let account = await Account.findOne({ accountId });

    if (account) {
      res.status(400).json({
        errors: [{
          msg: 'Account already exists',
        }],
      });
    }

    account = new Account({ accountId, accountType, balance });

    const responseAccountPost = await account.save();

    try {
      const defaultAccountId = responseAccountPost.account_id;

      user = new User({
        fullName, email, phoneNumber, password, role, defaultAccountId,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // const response = await userAction.createUser(user)
      // return MakeResponse(req, res, response)
      const response = await user.save();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).send('Server error');
    }
  } catch (error) {
    return res.status(500).send('Server error');
  }
});


router.get('/', async (req, res) => {
  const user = {
    role: 'CUSTOMER',
  };

  const response = await userAction.getUser(user, null, 0, 1000, true, true);
  return MakeResponse(req, res, response);
  // res.status(APIStatus.Ok).json(response)
});

router.put('/', async (req, res) => {
  const input = {
    role: 'CUSTOMER',
    full_name: 'Sơn',
  };

  const response = await userAction.updateUser(input);
  return MakeResponse(req, res, response);
});

// router.delete("/", async (req, res) => {
//     const input = {
//         phone_number: "0979279933"
//     }

//     let response = await userAction.deleteUser(input)
//     return MakeResponse(req, res, response)
// })

module.exports = router;
