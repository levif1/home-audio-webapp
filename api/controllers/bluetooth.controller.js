const bluetooth = require("../services/bluetooth.service");

exports.status = async (req, res) => {
  try {
    const status = await bluetooth.getStatus();

    res.json(status);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

exports.scan = async (req, res) => {
  try {
    const devices = await bluetooth.scan();

    res.json(devices);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

exports.discoverable = async (req, res) => {
  try {
    const result = await bluetooth.makeDiscoverable();

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

exports.undiscoverable = async (req, res) => {
  try {
    const result = await bluetooth.makeUndiscoverable();

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};


exports.devices = async (req, res) => {
  try {
    const devices = await bluetooth.connectedDevices();

    res.json(devices);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

exports.connect = async (req, res) => {
  try {
    const { mac } = req.body;

    const result = await bluetooth.connect(mac);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

exports.disconnect = async (req, res) => {
  try {
    const { mac } = req.body;

    const result = await bluetooth.disconnect(mac);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};

exports.pairedDevices = async (req, res) => {
  try {
    const result = await bluetooth.pairedDevices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
};
