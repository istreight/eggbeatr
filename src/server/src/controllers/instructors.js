const Models = require('../models');

const Private = Models.Private;
const Instructor = Models.Instructor;
const InstructorPreference = Models.InstructorPreference;

module.exports = {
    list(req, res) {
        return Instructor.findAll({
            where: {
                headerId: req.query.headerId
            },
            include: [{
                    model: InstructorPreference,
                    as: 'instructorPreferences'
                }, {
                    model: Private,
                    as: 'privates'
            }]
        }).then((instructor) => {
            res.status(200).send(instructor);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return Instructor.create({
            headerId: req.query.headerId,
            instructor: req.body.instructor,
            dateOfHire: req.body.dateOfHire,
            privatesOnly: req.body.privatesOnly,
            wsiExpiration: req.body.wsiExpiration
        }).then((instructor) => {
            res.status(201).send(instructor);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return Instructor.findByPk(req.params.instructorId, {
            include: [{
                    model: InstructorPreference,
                    as: 'instructorPreferences'
                }, {
                    model: Private,
                    as: 'privates'
            }]
        }).then((instructor) => {
            if (!instructor) {
                return res.status(404).send({
                    message: 'Instructor Not Found.'
                });
            }

            return res.status(200).send(instructor);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return Instructor.findByPk(req.params.instructorId, {
            include: [{
                    model: InstructorPreference,
                    as: 'instructorPreferences'
                }, {
                    model: Private,
                    as: 'privates'
            }]
        }).then((instructor) => {
            if (!instructor) {
                return res.status(404).send({
                    message: 'Instructor Not Found.'
                });
            }

            var p = req.body.privatesOnly || instructor.privatesOnly;
            if (req.body.privatesOnly === false) {
                p = false;
            }

            return instructor.update({
                headerId: req.query.headerId || instructor.headerId,
                instructor: req.body.instructor || instructor.instructor,
                dateOfHire: req.body.dateOfHire || instructor.dateOfHire,
                privatesOnly: p,
                wsiExpiration: req.body.wsiExpiration || instructor.wsiExpiration
            }).then((instructor) => {
                res.status(200).send(instructor);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return Instructor.findByPk(req.params.instructorId).then((instructor) => {
            if (!instructor) {
                return res.status(404).send({
                    message: 'Instructor Not Found.'
                });
            }

            return instructor.destroy().then(() => {
                res.status(200).send({
                    message: 'Instructor Deleted Successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
