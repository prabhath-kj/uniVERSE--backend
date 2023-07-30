import {Schema,model} from "mongoose"
const activitySchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  posts: {
    type: Number,
    default: 0,
  },
  users: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
});



const Activity = model('Activity', activitySchema);

export default Activity;
