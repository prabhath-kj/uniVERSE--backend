import Post from "../models/post.js";
import Report from "../models/report.js";
import cloudinary from "../services/clodinary.js";

export const create = async (req, res) => {
  try {
    const paths = [];

    if (req.files) {
      for (const file of req.files) {
        const res = await cloudinary.uploader.upload(file.path);
        paths.push(res?.secure_url);
      }
    }
    console.log(paths);
    const { text } = req.body;
    const { _id, username, profilePic } = req.user;

    const newPost = new Post({
      userId: _id,
      username: username,
      userPicturePath: profilePic,
      picturePath: paths.length > 0 ? paths : [],
      description: text || "",
      likes: {},
      comments: [],
    });

    await newPost.save();

    const posts = await Post.find({isDeleted:false});
    res.status(201).json({ post: posts });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const getTimeLine = async (req, res) => {
  try {
    const post = await Post.find({isDeleted:false});
    res.status(200).json({ post: post });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId ,isDeleted:false});
    res.status(200).json({ post: post });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const post = await Post.findById(id);

    const isLiked = post.likes.get(_id);
    if (isLiked) {
      post.likes.delete(_id);
    } else {
      post.likes.set(_id, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json({ post: updatedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id,set } = req.body;
  const updatedPost=  await Post.findByIdAndUpdate(
      id,
      {
        isDeleted:set,
      },
      {
        new: true,
      }
    );

    res.status(200).json({post:updatedPost, success: true, message: "Successfully updated" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { _id } = req.user;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post is already saved by the user
    const isSaved = post.savedBy.indexOf(_id);
    if (isSaved != -1) {
      post.savedBy.splice(isSaved, 1);
      await post.save();
      return res.status(200).json({ message: "Post unsaved successfully" });
    } else {
      // Add the user to the savedBy array in the post document
      post.savedBy.push(_id);
      await post.save();

      return res.json({ message: "Post saved successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDrafted = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(_id);
    const savedPosts = await Post.find({ savedBy: _id });
    return res.json({ savedPosts: savedPosts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const reportPost = async (req, res) => {
  try {
    const { postId, reason } = req.body;
    const { _id } = req.user;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Store the report information
    const report = new Report({
      postId,
      reportedBy: _id,
      reason,
    });
    await report.save();

    return res.json({ message: "Post reported successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getReportedPosts = async (req, res) => {
  try {
    // Find all reported posts
    const reportedPosts = await Report.find().populate("postId");
    return res.json({ report: reportedPosts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteReport = async (req, res) => {
  try {

    await Report.findByIdAndDelete(req.body.reportId);
    return res.json({ message:"Successfully updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};