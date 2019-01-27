var express = require('express');
var router = express.Router();

router.get('/', isAdmin, function(req, res) {
	res.render('admin/index.ejs');
});

// Create new server
// Select server
  // Create invite code w/ Owner roles

module.exports = router;

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.status(403).send('Forbidden');
}
