// app/services/userService.ts
import { Db, ObjectId } from "mongodb";
import { BaseUser } from "../types/baseUser";

export type UserType = "trainer" | "Trainee";




export async function findUserByEmail(email: string, db: Db, type: UserType) {
  const collection = type === "trainer" ? "trainer" : "Trainee";
  return await db.collection<BaseUser>(collection).findOne({ email });
}

export async function createUser(user: BaseUser, db: Db, type: UserType) {
  const collection = type === "trainer" ? "trainer" : "Trainee";
  const result = await db.collection<BaseUser>(collection).insertOne(user);
  return result.insertedId;
}