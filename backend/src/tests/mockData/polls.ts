import { Poll } from "@shared/types/db";
import { ObjectId } from "mongodb";

export const validPolls: Poll[] = [
  {
    _id: new ObjectId(),
    options: [
      {
        date: "2024-01-01",
        slots: {
          "00:00-01:00": 0,
          "01:00-02:00": 1
        }
      }
    ],
    timeout: new Date(),
    results: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  } 
]

export const invalidPolls: Poll[] = [

]