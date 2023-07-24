import Comment from "../models/comment.js";

export const postComment = async (req, res) => {
  try {
    const { _id } = req.user;
    const { postId, comment } = req.body;

    // Create a new comment with the user ID, post ID, and comment text
    const newComment = new Comment({
      userId: _id,
      postId: postId,
      comment: comment,
    });

    await newComment.save();

    res.status(200).json({ message: "Successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to post comment" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId: postId });
    res.json({ comments: comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.body;

    await Comment.findByIdAndDelete(id);

    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete the comment" });
  }
};

export const likeComment = async (req, res) => {
  const { _id: userId } = req.user;
  const { commentId } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const indexOfUser = comment.likes.indexOf(userId);

    if (indexOfUser === -1) {
      // User ID is not present in the likes array, so add it.
      comment.likes.push(userId);
    } else {
      // User ID is present in the likes array, so remove it.
      comment.likes.splice(indexOfUser, 1);
    }

    await comment.save();

    res.json({ message:"Liked" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { commentId, reply } = req.body;

    const parentReply = await Comment.findById(commentId);
    if (!parentReply) {
      return res.status(404).json({ error: "Parent reply not found." });
    }

    const newReply = await Comment.create({
      userId,
      comment: reply,
      parent: commentId,
    });

    parentReply.replies.push(newReply._id);
    await parentReply.save();

    return res.status(201).json({ message: "Successfully updated." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add reply." });
  }
};
