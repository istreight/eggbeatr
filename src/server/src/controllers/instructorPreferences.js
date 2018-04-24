const Models = require('../models');

const Instructor = Models.Instructor;
const InstructorPreference = Models.InstructorPreference;

module.exports = {
    retrieve(req, res) {
        return InstructorPreference.findById(req.params.preferenceId).then((instructorPreference) => {
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
    update(req, res) {
        return InstructorPreference.findById(req.params.preferenceId).then((instructorPreference) => {
            if (!instructorPreference) {
                return res.status(404).send({
                    message: 'InstructorPreference Not Found',
                });
            }

            return instructorPreference.update({
                instructorId: req.body.instructorId,
                instructor: req.body.instructor,
                lessons: JSON.parse(req.body.lessons)
            }).then((instructor) => {
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
                    message: 'InstructorPreference Not Found',
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
