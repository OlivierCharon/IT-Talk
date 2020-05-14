const express = require('express');
const createError = require('http-errors');
const uniqid = require('uniqid');
const Mongo = require('../bin/mongo');
const ObjectId = require('mongodb').ObjectId;
const socketio = require('socket.io');
const router = express.Router();

router.get('/', function (req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.render('index', { title: 'IT-Talk' });
});

router.use(function (req, res, next) {
  // si la session n'existe pas
  if (!req.session.user) {
    console.log('forbiden');
    return next(createError(403));
  }
  return next();
});

/* return le dashboard des rooms */
router.get('/', function (req, res, next) {
  // res.render('dashboard', { title: 'IT-Talk' }); // DEBUG 
  Mongo.getInstance()
    .collection('ITTRoom')
    .find({
      $or: [
        {id_owner: req.session.user._id,
        confidentiality: true},
        {confidentiality: false}]
      })
    .toArray(function (err, result) {
      if (err) {
        throw err;
      } else {
        res.render('dashboard', { title: 'IT-Talk', allITTchats: result, user_id: req.session.user._id });
      }
    })
});

/* create ITT Room */
router.post('/', function (req, res, next) {
  var errors = [];

  console.log(req.body);
  console.log(req.body.confidentiality != true);
  console.log(req.body.confidentiality != false);
  console.log(req.body.confidentiality != true && req.body.confidentiality != false);
  if (!req.body.title || !/^([\w\s]{3,})$/.test(req.body.title)) {
    errors.push('Titre');
  }

  let confidentiality = null;
  if (!req.body.confidentiality) {
    errors.push('Confidentialité');
  } else {
    if (req.body.confidentiality == 'true') {
      confidentiality = true
    } else if (req.body.confidentiality == 'false') {
      confidentiality = false
    }  else {
      errors.push('Confidentialité');
    }
  }

    if (errors.length) {
      return res.json({
        status: false,
        msg: 'Merci de vérifier les champs suivants: ' + errors.join(', ')
      })
    }

    let datas = {
      title: req.body.title,
      confidentiality: confidentiality,
      id_owner: req.session.user._id,
      owner: req.session.user.nickname,
      date: new Date()
    }

    Mongo.getInstance()
      .collection('ITTRoom')
      .insertOne(datas,
        function (err, result) {
          return res.redirect('/');
        })
  });



/* Get ITT Room infos */
router.get('/:id', function (req, res, next) {

});

/* Edit ITT Room */
router.put('/:id', function (req, res, next) {
  const id = req.params.id;
  const title = req.body.title
  let errors = [];

  let confidentiality = null;
  if (!req.body.confidentiality) {
    errors.push('Confidentialité');
  } else {
    if (req.body.confidentiality == 'true') {
      confidentiality = true
    } else if (req.body.confidentiality == 'false') {
      confidentiality = false
    }  else {
      errors.push('Confidentialité');
    }
  }

  if (!req.body.title || !/^([\w\s]{6,})$/.test(req.body.title)) {
    errors.push('Titre');
  }

  if (errors.length) {
    return res.json({
      status: false,
      msg: 'Merci de vérifier les champs suivants: ' + errors.join(', ')
    })
  }

  Mongo.getInstance()
    .collection('ITTRoom')
    .updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        title: req.body.title,
        confidentiality: confidentiality,
      }
    }, function (err, result) {
      if (err) {
        return res.json({
          status: false,
          message: err.message
        });
      } else {
        return res.json({
          status: true
        });
      }
    });
});

/* Delete ITT Room */
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;

  Mongo.getInstance()
    .collection('ITTRoom')
    .findOne({
      _id: new ObjectId(id)
    }, (err, room) => {
      if (err) {
        return res.json({ status: false, message: err.message });
      }
      if (!room._id) {
        return res.json({ status: false, message: 'document non trouvé' });
      }
      Mongo.getInstance()
        .collection('ITTRoom')
        .deleteOne({
          _id: new ObjectId(id)
        }, function (err, result) {
          console.log(result);
          if (err) {
            return res.json({
              status: false,
              message: err.message
            });
          }
          res.json({
            status: result.deletedCount === 1
          });
        });

    });
});

module.exports = router;