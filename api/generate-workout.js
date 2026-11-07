const { handleGenerateWorkout } = require('../server/workout-api');
module.exports = async (req, res) => handleGenerateWorkout(req, res);
