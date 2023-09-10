const { ProgresPerbaikan, Perbaikan } = require('../db/models');
const {
  progresPerbaikanValidationSchema,
} = require('../validator/progresPerbaikanValidator');
const {
  imageFileUpload,
  deleteFile,
} = require('../controllers/fileUploadController');

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
    const { perbaikan_id, keterangan } = req.body;

    const { error } = progresPerbaikanValidationSchema.validate({
      perbaikan_id,
      keterangan,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto progres perbaikan tidak boleh kosong!' });
    }

    try {
      const image = req.files.foto;
      const destination = '/upload/images/progres-perbaikan/';

      const { fileName, fileUrl } = await imageFileUpload(
        req,
        image,
        destination
      );

      foto = fileName;
      foto_url = fileUrl;
    } catch (uploadError) {
      return res.status(400).json({
        message: 'Error uploading the image!',
        error: uploadError.message,
      });
    }

    const newProgresPerbaikan = await ProgresPerbaikan.create({
      perbaikan_id,
      keterangan,
      foto,
      foto_url,
    });

    return res.status(201).json({
      message: 'Progres perbaikan berhasil disimpan!',
      id: newProgresPerbaikan.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function updateProgresPerbaikan(req, res) {
  try {
    const { id } = req.params;
    const progresPerbaikan = await ProgresPerbaikan.findByPk(id);

    if (!progresPerbaikan) {
      return res
        .status(404)
        .json({ message: 'Progres perbaikan tidak ditemukan!' });
    }

    const { perbaikan_id, keterangan } = req.body;

    const { error } = progresPerbaikanValidationSchema.validate({
      perbaikan_id,
      keterangan,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    var foto = progresPerbaikan.foto;
    var foto_url = progresPerbaikan.foto_url;

    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/progres-perbaikan/';

        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

        if (foto !== fileName) {
          if (progresPerbaikan.foto) {
            const destination = '/upload/images/progres-perbaikan/';
            const fileName = progresPerbaikan.foto;

            await deleteFile(destination, fileName);
          }
        }

        foto = fileName;
        foto_url = fileUrl;
      } catch (uploadError) {
        return res.status(400).json({
          message: 'Error uploading the image!',
          error: uploadError.message,
        });
      }
    }

    await progresPerbaikan.update({
      perbaikan_id,
      keterangan,
      foto,
      foto_url,
    });

    return res.status(200).json({
      message: 'Progres perbaikan berhasil diperbarui!',
      id: progresPerbaikan.id,
    });
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
