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

async function getProgresPerbaikanById(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: 'Invalid ID format. ID must be an integer.' });
    }

    const progresPerbaikan = await ProgresPerbaikan.findByPk(id, {
      include: {
        model: Perbaikan,
        as: 'perbaikan',
        attributes: ['id'],
      },
    });

    if (!progresPerbaikan) {
      return res
        .status(404)
        .json({ message: 'Progres Perbaikan tidak ditemukan!' });
    }

    return res.status(200).json(progresPerbaikan);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function getProgresPerbaikanByPerbaikanId(req, res) {
  try {
    const { id: perbaikan_id } = req.params;
    const progresPerbaikan = await ProgresPerbaikan.findAll({
      where: { perbaikan_id: perbaikan_id },
      order: [['createdAt', 'DESC']],
    });

    if (!progresPerbaikan) {
      return res
        .status(404)
        .json({ message: 'Progres Perbaikan tidak ditemukan!' });
    }

    return res.status(200).json(progresPerbaikan);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
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
  getProgresPerbaikanByPerbaikanId,
};
