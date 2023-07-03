import Post from "../models/post.js";
import cloudinary from "../services/clodinary.js";


export const create = async (req, res) => {
  console.log(req.user);

    try {
       if(req.file){
        var {secure_url} = await cloudinary.uploader.upload(req?.file?.path)
      }
        // const {secure_url} = await cloudinary.uploader.upload(req?.file?.path)
        const {text} = req.body;
        const {_id,username,profilePic}=req.user
        const newPost = new Post({
          userId:_id,
          username:username,
          userPicturePath:profilePic,
          picturePath:secure_url??"",
          description:text??"",
          likes: {},
          comments: [],
        });
        await newPost.save();
    
        const post = await Post.find();
        res.status(201).json({post:post});
      } catch (err) {
        console.log(err);
        res.status(409).json({ message: err.message });
      }
};


export const getTimeLine = async (req, res) => {
    try {
      const post = await Post.find();
      res.status(200).json({post:post});
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });
      res.status(200).json({post:post});
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
  
      res.status(200).json({post:updatedPost});
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };