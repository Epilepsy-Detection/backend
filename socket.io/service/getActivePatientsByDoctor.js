const redisClient = require("../setup/redisClient");
const Patient = require('../../models/mongoose/patient')


module.exports.getActivePatientsByDoctor = async (doctorSocketId) => {
    // TODO: ADJUST THIS TO WORK
    const client = redisClient.getInstance();
    const doctorId = await client.hGet(`CONN:${doctorSocketId}`, 'profileId');

    const patients = await Patient.find({_doctorId: doctorId});

    if (!patients || patients.length === 0) return [];

    const patientsIds = patients.map(patient => patient._id.toString());
    const searchString = patientsIds.join(" | ");

    const results = await client.ft.search(
      'idx:connProfileId',
      `@profileId:"${searchString}"`
    );

    const ids = results.documents.map((document) => document.value["profileId"]);

    return ids;


}