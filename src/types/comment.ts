import { ObjectId } from "mongodb";

export interface Comment {
  traineeId: string;
  rating: number;
  comment: string;
  date: Date;
}
