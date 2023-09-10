const { ProgresPerbaikan, Perbaikan } = require('../db/models');

async function getAllProgresPerbaikan(req, res) {
  try {
    const progresPerbaikans = await ProgresPerbaikan.findAll({
      include: {
        model: Perbaikan,
        as: 'perbaikan',
        attributes: ['id'],
      },
      limit: 10,
    });

    return res.status(200).json(progresPerbaikans);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function storeProgresPerbaikan(req, res) {
  try {
    return res.status(200).json('storeProgresPerbaikan');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function getProgresPerbaikanById(req, res) {
  try {
    return res.status(200).json('getProgresPerbaikanById');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function updateProgresPerbaikan(req, res) {
  try {
    return res.status(200).json('updateProgresPerbaikan');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function destroyProgresPerbaikan(req, res) {
  try {
    return res.status(200).json('destroyProgresPerbaikan');
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  getAllProgresPerbaikan,
  getProgresPerbaikanById,
  storeProgresPerbaikan,
  updateProgresPerbaikan,
  destroyProgresPerbaikan,
};
