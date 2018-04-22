const Models = require('../models');

const Instructor = Models.Instructor;
const InstructorPreference = Models.InstructorPreference;

module.exports = {
    retrieve(req, res) {
        return InstructorPreference.findById(
            req.params.instructorPreferenceId
        ).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found'
                });
            }

            return res.status(200).send(instructorPreference);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return InstructorPreference.create({
            lessons: req.body.lessons
        }).then((instructorPreference) => {
            res.status(201).send(instructorPreference);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return InstructorPreference.find({
            where: {
                instructorPreferenceId: req.params.instructorPreferenceId,
                instructorId: req.params.instructorId
            }
        }).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found',
                });
            }

            return instructorPreference.update({
                content: req.body.lessons || instructorPreference.lessons,
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
        return InstructorPreference.find({
            where: {
                instructorPreferenceId: req.params.instructorPreferenceId,
                instructorId: req.params.instructorId
            }
        }).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found',
                });
            }

            return instructorPreference.destroy().then(() => {
                res.status(200).send({
                    message: 'InstructorPreference deleted successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
