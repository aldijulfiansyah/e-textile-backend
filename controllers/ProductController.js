import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// const path = require("path");

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/"); // Direktori penyimpanan file di public/images/
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const filename = `${uuidv4()}.${extension}`; // Nama unik file dengan menggunakan UUID
    cb(null, filename);
  },
});
const upload = multer({ storage });

export const getProducts = async (req, res) => {
  const { page = 1, perPage = 20 } = req.query;

  try {
    const totalCount = await prisma.products.count();
    const totalPages = Math.ceil(totalCount / perPage);
    const offset = (page - 1) * perPage;

    const products = await prisma.products.findMany({
      include: {
        category: true,
        images: true,
      },
      skip: offset,
      take: perPage,
    });

    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: parseInt(page),
      perPage: parseInt(perPage),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        category: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, desc, categoryId } = req.body;
  try {
    const newProducts = await prisma.products.create({
      data: {
        name: name,
        price: price,
        desc: desc,
        categoryId: categoryId,
      },
    });
    res.status(201).json(newProducts);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        price: price,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await prisma.products.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// 1 image
// export const uploadImageProduct = async (req, res) => {
//   try {
//     upload.single("image")(req, res, async (error) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to upload image for product" });
//         return;
//       }

//       if (!req.file) {
//         res.status(400).json({ error: "No image file provided" });
//         return;
//       }

//       const { name, price, desc, categoryId } = req.body;
//       const finalImageURL = `${req.file.filename}`;

//       try {
//         const createdProduct = await prisma.products.create({
//           data: {
//             name: name,
//             price: parseInt(price),
//             desc: desc,
//             image: finalImageURL,
//             categoryId: parseInt(categoryId),
//             createdAt: new Date(),
//           },
//         });

//         res.status(201).json(createdProduct);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to create product with image" });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to upload image for product" });
//   }
// };

// array image
export const uploadImageProduct = async (req, res) => {
  try {
    upload.array("images", 5)(req, res, async (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload images for product" });
        return;
      }

      if (!req.files || req.files.length === 0) {
        res.status(400).json({ error: "No image files provided" });
        return;
      }

      const { name, price, desc, categoryId } = req.body;

      try {
        const images = req.files.map((file) => ({
          imageUrl: file.filename,
        }));

        const createdProduct = await prisma.products.create({
          data: {
            name,
            price: parseInt(price),
            desc,
            categoryId: parseInt(categoryId),
            createdAt: new Date(),
            images: {
              create: images,
            },
          },
          include: {
            images: true,
          },
        });

        res.status(201).json(createdProduct);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create product with images" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload images for product" });
  }
};

// get Images by product ID
export const getProductImageById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
      include: {
        images: true,
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (!product.images || product.images.length === 0) {
      res.status(404).json({ error: "No images found for the product" });
      return;
    }

    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDirPath = dirname(currentFilePath);
    const imagePath = join(
      currentDirPath,
      "../public/images",
      product.images[0].imageUrl
    );

    res.status(200).sendFile(imagePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

// Get Image By  Image id
export const getImageById = async (req, res) => {
  const imageId = req.params.id;

  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) },
      include: {
        product: true,
      },
    });

    if (!image) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDirPath = dirname(currentFilePath);
    const imagePath = join(currentDirPath, "../public/images", image.imageUrl);

    res.status(200).sendFile(imagePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};
