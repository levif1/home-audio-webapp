const router = require("express").Router();
const controller = require("../controllers/bluetooth.controller");

router.get("/status", controller.status);

router.get("/devices", controller.devices);

router.get("/pairedDevices", controller.pairedDevices);

router.post("/scan", controller.scan);

router.post("/connect", controller.connect);

router.post("/disconnect", controller.disconnect);

router.post("/discoverable", controller.discoverable);

router.post("/undiscoverable", controller.undiscoverable);

module.exports = router;
