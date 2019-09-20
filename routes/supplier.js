const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Wallet = require('../classes/Wallet');
const SupplierModel = require('../models/supplier');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const wallet = new Wallet(true);

      // Generation of encrypted privatekey and address
      wallet
        .generateWifPrivateKey()
        .generatePublicKey()
        .generateRSKAddress()
        .encryptBIP38(req.body.passphrase)
        .toHex(['rskAddressFromPublicKey']);

      // Create DB record and hash password
      const supplier = await SupplierModel.register(
        new SupplierModel({
          username: req.body.name,
          email: req.body.email,
          address: wallet.rskAddressFromPublicKey,
          encryptedPrivateKey: wallet.wifPrivKey
        }),
        req.body.password
      );

      res.json(supplier);
    } catch (e) {
      res.json({ error: e.message });
    }
  })
);

module.exports = router;
