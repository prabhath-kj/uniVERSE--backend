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

    const comments = await Comment.find({ postId: postId, isDeleted: false })
      .populate("userId")
      .populate("replies.userId")
      .exec();


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

export const likeComment = async (req, res) => {
  const { _id: userId } = req.user;
  const { commentId } = req.body;

  try {
    const comment = await Comment.findById(commentId).populate("userId");
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

    res.json({ comment: comment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { _id:userId } = req.user;
    const { commentId, reply } = req.body;

    // Function to find the parent comment in the nested replies array
    const findParentComment = (comments, targetId) => {
      for (const comment of comments) {
        if (comment._id.toString() === targetId) {
          return comment;
        }
        if (comment.replies && comment.replies.length > 0) {
          const parentComment = findParentComment(comment.replies, targetId);
          if (parentComment) {
            return parentComment;
          }
        }
      }
      return null;
    };

    // Find the parent comment by its _id
    const parentComment = await findParentComment(
      await Comment.find(),
      commentId
    );

    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found." });
    }

    // Create the new reply object
    const newReply = {
      userId,
      comment:reply,
      date: new Date(),
    };

    // Add the new reply to the parent comment's replies array
    console.log(parentComment);
    parentComment.replies.push(newReply);

    // Save the updated parent comment
    await parentComment.save();

    const populatedParentComment = await Comment.findById(commentId)
      .populate({
        path: "replies",
        populate: { path: "userId" },
      })
      .populate("userId");

    return res.status(201).json({ comment: populatedParentComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add reply." });
  }
};
