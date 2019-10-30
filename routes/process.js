const express = require('express');
const Project = require('../classes/Project');
const Process = require('../classes/Process');
const web3 = require('web3');
const NuclearPoE = require('../classes/NuclearPoE');
const { getKeys, web3ArrayToJSArray } = require('../functions/utils');
const txModel = require('../models/transaction');

const router = express.Router({ mergeParams: true });

router.post('/create/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const process = new Project(wallet, privKey, req.params.contract);

    const txHash = await process.addProcess(
      req.body.supplierAddress,
      req.body.processTitle
    );

    await txModel.create({
      hash: txHash,
      proyecto: req.params.contract,
      subject: 'add-process',
      data: [req.body.processTitle, req.body.supplierAddress]
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: e.message });
  }
});

router.post('/get/:contract/:process', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const process = new Process(wallet, privKey, req.params.contract);

    const result = await process.returnProcessDetailsByOwner(
      req.params.process
    );

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/getAll/:contract', async (req, res) => {
  try {
    const process = new Project(undefined, undefined, req.params.contract);
    const nuclear = new NuclearPoE();

    const result = await process.return('returnAllProcess');

    let resultProcessed = [];
    for (let i = 0; i < result.length; i++) {
      const userName = await nuclear.return('getUserDetails', [result[i]]);
      const details = await process.return('returnProcessByOwner', [result[i]]);
      const convertedResult = web3ArrayToJSArray(details);
      resultProcessed.push([
        web3.utils.toAscii(convertedResult[0]),
        web3.utils.toAscii(userName[0]),
        convertedResult[1]
      ]);
    }
    res.json([resultProcessed]);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
