const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()
const { db } = require('../config/dbConfig');
const userCollection = db.collection("users");
const jobCollection = db.collection("jobs");

router.get("/candidates/:jobId", async (req, res) => {
    const { jobId } = req.params

    const jobs = await jobCollection.findOne({ _id: ObjectId(jobId) })
    const applicantsEmail = jobs.applicants.map(applicant => applicant.email)
    const cursor = userCollection.find({ 'email': { '$in': applicantsEmail } });
    const result = await cursor.toArray();
    return res.send({ status: true, data: result });
});

module.exports = router