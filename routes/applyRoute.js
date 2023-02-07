const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()
const { db } = require('../config/dbConfig');
const jobCollection = db.collection("jobs");

router.patch("/apply", async (req, res) => {
    const userId = req.body.userId;
    const jobId = req.body.jobId;
    const email = req.body.email;

    const filter = { _id: ObjectId(jobId) };
    const updateDoc = {
        $push: { applicants: { id: ObjectId(userId), email } },
    };

    const result = await jobCollection.updateOne(filter, updateDoc);

    if (result.acknowledged) {
        return res.send({ status: true, data: result });
    }

    res.send({ status: false });
});

router.patch("/query", async (req, res) => {
    const userId = req.body.userId;
    const jobId = req.body.jobId;
    const email = req.body.email;
    const question = req.body.question;

    const filter = { _id: ObjectId(jobId) };
    const updateDoc = {
        $push: {
            queries: {
                id: ObjectId(userId),
                email,
                question: question,
                reply: [],
            },
        },
    };

    const result = await jobCollection.updateOne(filter, updateDoc);

    if (result?.acknowledged) {
        return res.send({ status: true, data: result });
    }

    res.send({ status: false });
});

router.patch("/reply", async (req, res) => {
    const userId = req.body.userId;
    const reply = req.body.reply;

    const filter = { "queries.id": ObjectId(userId) };

    const updateDoc = {
        $push: {
            "queries.$[user].reply": reply,
        },
    };
    const arrayFilter = {
        arrayFilters: [{ "user.id": ObjectId(userId) }],
    };

    const result = await jobCollection.updateOne(
        filter,
        updateDoc,
        arrayFilter
    );
    if (result.acknowledged) {
        return res.send({ status: true, data: result });
    }

    res.send({ status: false });
});

module.exports = router