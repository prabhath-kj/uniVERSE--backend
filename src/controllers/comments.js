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
    console.log(postId);
    // Find all comments associated with the given post ID
    const comments = await Comment.find({ postId: postId,isDeleted:false }).populate("userId");

    res.json({ comments: comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    res.json({ message: "Successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete the comment" });
  }
};
