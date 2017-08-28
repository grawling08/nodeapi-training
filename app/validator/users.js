'use strict';

exports.validateUser = (req, res, next) => {
    req.checkBody('firstname', 'Please enter user Firstname').notEmpty();
    req.checkBody('lastname', 'Please enter user Lastname').notEmpty();
    req.checkBody('username', 'Please enter user Username').notEmpty();
    req.checkBody('password', 'Please enter user Password').notEmpty();
    req.checkBody('password', 'Password must be 6 to 20 characters in length').len(6,20);

    req.getValidationResult().then(function(result){
        if (!result.isEmpty()) {
            res.status(400).send({
                success: false,
                result: result.array()
            });
            return;
        }
        next();
    });
}