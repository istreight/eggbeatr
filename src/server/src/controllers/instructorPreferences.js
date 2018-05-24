const Models = require('../models');

const InstructorPreference = Models.InstructorPreference;

module.exports = {
    list(req, res) {
        return InstructorPreference.findAll({
            where: {
                headerId: req.query.headerId
            }
        }).then((preference) => {
            res.status(200).send(preference);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return InstructorPreference.create({
            headerId: req.query.headerId,
            instructorId: req.body.instructorId,
            lessons: req.body.lessons
        }).then((preference) => {
            res.status(201).send(preference);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return InstructorPreference.findById(req.params.preferenceId).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found.'
                });
            }

            return res.status(200).send(instructorPreference);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return InstructorPreference.findById(req.params.preferenceId).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found.',
                });
            }

            return instructorPreference.update({
                headerId: req.query.headerId || instructorPreference.headerId,
                instructorId: req.body.instructorId || instructorPreference.instructorId,
                lessons: req.body.lessons || instructorPreference.lessons
            }).then((instructorPreference) => {
                res.status(200).send(instructorPreference);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return InstructorPreference.findById(req.params.preferenceId).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found.',
                });
            }

            return instructorPreference.destroy().then(() => {
                res.status(200).send({
                    message: 'InstructorPreference Deleted Successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
