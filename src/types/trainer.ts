import { ObjectId } from "mongodb";
import { Comment } from "./comment";

export interface Trainer {
  _id: ObjectId;
  name: string;
  comments?: Comment[];
}
