const { ProgresPerbaikan, Perbaikan } = require('../db/models');
const {
  progresPerbaikanValidationSchema,
} = require('../validator/progresPerbaikanValidator');
const {
  imageFileUpload,
  deleteFile,
} = require('../controllers/fileUploadController');

// Get all progres perbaikans
async function getAllProgresPerbaikan(req, res) {
  try {
    // Retrieve a list of progres perbaikans with a limit of 100 records
    const progresPerbaikans = await ProgresPerbaikan.findAll({
      include: {
        model: Perbaikan,
        as: 'perbaikan',
        attributes: ['id'],
      },
      limit: 100,
    });

    return res.status(200).json(progresPerbaikans);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Get progres perbaikan by ID
async function getProgresPerbaikanById(req, res) {
  try {
    const { id } = req.params;

    // Check if 'id' is a valid integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: 'Invalid ID format. ID must be an integer.' });
    }

    // Find the progres perbaikan by its primary key (ID)
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

// Get progres perbaikan by Perbaikan ID
async function getProgresPerbaikanByPerbaikan(req, res) {
  try {
    const { id: perbaikan_id } = req.params;

    // Find all progres perbaikan associated with the specified Perbaikan ID
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

// Create new progres perbaikan
async function storeProgresPerbaikan(req, res) {
  try {
    const { perbaikan_id, keterangan } = req.body;

    // Validate the request body using the progres perbaikan validation schema
    const { error } = progresPerbaikanValidationSchema.validate({
      perbaikan_id,
      keterangan,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Check if the request contains a 'foto' file
    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto progres perbaikan tidak boleh kosong!' });
    }

    try {
      const image = req.files.foto;
      const destination = '/upload/images/progres-perbaikan/';

      // Upload the image and get the generated 'fileName' and 'fileUrl'
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

    // Create a new ProgresPerbaikan record in the database with the provided data
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

// Update progres perbaikan
async function updateProgresPerbaikan(req, res) {
  try {
    const { id } = req.params;

    // Find the ProgresPerbaikan record by its ID
    const progresPerbaikan = await ProgresPerbaikan.findByPk(id);

    if (!progresPerbaikan) {
      return res
        .status(404)
        .json({ message: 'Progres perbaikan tidak ditemukan!' });
    }

    const { perbaikan_id, keterangan } = req.body;

    // Validate the request body using the progres perbaikan validation schema
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

    // Check if the request contains a 'foto' file
    if (req.files && req.files.foto) {
      try {
        // Retrieve the 'foto' file from the request
        const image = req.files.foto;
        const destination = '/upload/images/progres-perbaikan/';

        // Upload the image and get the generated 'fileName' and 'fileUrl'
        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

        // If the 'fileName' has changed, delete the old image (if it exists)
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

    // Update the ProgresPerbaikan record with the provided data
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

// Delete progres perbaikan
async function destroyProgresPerbaikan(req, res) {
  try {
    const { id } = req.params;

    // Find the ProgresPerbaikan record by its ID
    const progresPerbaikan = await ProgresPerbaikan.findByPk(id);

    if (!progresPerbaikan) {
      return res
        .status(404)
        .json({ message: 'Progres perbaikan tidak ditemukan!' });
    }

    // Check if the ProgresPerbaikan record has a 'foto' associated with it
    if (progresPerbaikan.foto) {
      // Define the destination folder for the associated image
      const destination = '/upload/images/progres-perbaikan/';
      const fileName = progresPerbaikan.foto;

      // Delete the associated image file from the server
      await deleteFile(destination, fileName);
    }

    // Delete the ProgresPerbaikan record from the database
    await progresPerbaikan.destroy();

    return res.status(200).json({
      message: 'Progres perbaikan berhasil dihapus!',
      id,
    });
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
  getProgresPerbaikanByPerbaikan,
  storeProgresPerbaikan,
  updateProgresPerbaikan,
  destroyProgresPerbaikan,
};
