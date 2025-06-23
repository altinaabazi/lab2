import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongodb';

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...post, isSaved: false });
        }

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        return res.status(200).json({ ...post, isSaved: !!saved });
      });
    }

    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// export const updatePost = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;
//   const body = req.body;

//   try {
//     const post = await prisma.post.findUnique({ where: { id } });

//     if (!post || post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not Authorized!" });
//     }

//     const updatedPost = await prisma.post.update({
//       where: { id },
//       data: {
//         ...body,
//       },
//     });

//     res.status(200).json(updatedPost);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to update post" });
//   }
// };



export const updatePost = async (req, res) => {
  const postId = req.params.id;
  console.log("Received postId:", postId);

  if (!postId) {
    return res.status(400).json({ message: "Post ID is missing." });
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { postDetail: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: req.body.title,
        price: req.body.price,
        images: req.body.images,
        address: req.body.address,
        city: req.body.city,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        type: req.body.type,
        property: req.body.property,
        postDetail: {
          update: {
            desc: req.body.postDetail.desc,
            utilities: req.body.postDetail.utilities,
            pet: req.body.postDetail.pet,
            income: req.body.postDetail.income,
            size: req.body.postDetail.size,
            school: req.body.postDetail.school,
            bus: req.body.postDetail.bus,
            restaurant: req.body.postDetail.restaurant,
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const countPosts = async (req, res) => {
  try {
    const totalPosts = await prisma.post.count();
    res.status(200).json({ total: totalPosts });
  } catch (err) {
    console.error("Gabim gjatë numërimit të postimeve:", err);
    res.status(500).json({ message: "Dështoi marrja e numrit të postimeve" });
  }
};
export const postsByCity = async (req, res) => {
  try {
    const grouped = await prisma.post.groupBy({
      by: ['city'],
      _count: {
        city: true,
      },
    });
    // Kthe një array me objekte { city: "Tiranë", _count: { city: 10 } }
    res.status(200).json(grouped);
  } catch (err) {
    console.error("Gabim gjatë marrjes së postimeve sipas qyteteve:", err);
    res.status(500).json({ message: "Dështoi marrja e postimeve sipas qyteteve" });
  }
};

export const deletePost = async (req, res) => {
  console.log("ID e përdoruesit nga tokeni:", req.userId);
  console.log("ID e postimit për fshirje:", req.params.id);

  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      console.log("Postimi nuk u gjet me ID:", req.params.id);
      return res.status(404).json({ message: "Postimi nuk u gjet" });
    }

    if (post.userId !== req.userId && req.userRole !== "ADMIN") {
      console.log("Jo e autorizuar për fshirje:", req.userId, req.userRole);
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Kontrollo nëse ka detaje që duhen fshirë para
    const details = await prisma.postDetail.findMany({
      where: { postId: req.params.id },
    });
    if (details.length > 0) {
      console.log("Fshirja e postDetail për postId:", req.params.id);
      await prisma.postDetail.deleteMany({
        where: { postId: req.params.id },
      });
    }

    await prisma.post.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log("Gabim gjatë fshirjes së postimit:", err);
    res.status(500).json({ message: "Dështoi fshirja e postimit" });
  }
};
