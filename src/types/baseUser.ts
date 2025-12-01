import { ObjectId } from "mongodb";

export interface BaseUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  isTrainer: boolean;
  favorites: string[];
}