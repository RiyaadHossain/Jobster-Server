const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()
const { db } = require('../config/dbConfig');
const jobCollection = db.collection("jobs");

router.get("/applied-jobs/:email", async (req, res) => {
    const email = req.params.email;
    const query = { applicants: { $elemMatch: { email } } };
    const cursor = jobCollection.find(query);
    const result = await cursor.toArray();

    res.send({ status: true, data: result });
});

router.get("/applied-jobs/:email/job/:jobId", async (req, res) => {
    const email = req.params.email;
    const jobId = req.params.jobId
    const query = { _id: ObjectId(jobId), applicants: { $elemMatch: { email: email } } };
    const cursor = jobCollection.find(query).project({ applicants: 0 });
    const result = await cursor.toArray();

    res.send({ status: true, data: result });
});

router.get("/jobs", async (req, res) => {
    const cursor = jobCollection.find({});
    const result = await cursor.toArray();
    res.send({ status: true, data: result });
});

router.get("/employee-jobs/:email", async (req, res) => {
    const { email } = req.params
    const cursor = jobCollection.find({ 'postedBy.email': email });
    const result = await cursor.toArray();
    res.send({ status: true, data: result });
});

router.get("/job/:id", async (req, res) => {
    const id = req.params.id;

    const result = await jobCollection.findOne({ _id: ObjectId(id) });
    res.send({ status: true, data: result });
});

router.post("/job", async (req, res) => {
    const job = req.body;

    const result = await jobCollection.insertOne(job);

    res.send({ status: true, data: result });
});

module.exports = router