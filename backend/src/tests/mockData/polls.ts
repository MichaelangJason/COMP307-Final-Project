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
  },
  {
    _id: new ObjectId(),
    options: [
      {
        date: "2024-02-15",
        slots: {
          "09:00-10:00": 3,
          "10:00-11:00": 2,
          "11:00-12:00": 1
        }
      },
      {
        date: "2024-02-16", 
        slots: {
          "13:00-14:00": 4,
          "14:00-15:00": 2,
          "15:00-16:00": 0
        }
      },
      {
        date: "2024-02-17",
        slots: {
          "10:00-11:00": 1,
          "11:00-12:00": 3,
          "12:00-13:00": 2
        }
      }
    ],
    timeout: new Date(),
    results: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    options: [
      {
        date: "2024-03-01",
        slots: {
          "14:00-15:00": 2,
          "15:00-16:00": 4,
          "16:00-17:00": 1
        }
      },
      {
        date: "2024-03-02",
        slots: {
          "09:00-10:00": 0,
          "10:00-11:00": 3,
          "11:00-12:00": 5
        }
      },
      {
        date: "2024-03-03",
        slots: {
          "13:00-14:00": 2,
          "14:00-15:00": 1,
          "15:00-16:00": 3
        }
      }
    ],
    timeout: new Date(),
    results: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const invalidPolls: any[] = [
  {
    // Missing required field 'options'
    timeout: new Date(),
    results: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    // Empty options array (violates minItems: 1)
    options: [],
    timeout: new Date(), 
    results: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    options: [
      {
        // Invalid date format
        date: "2024/03/01",
        slots: {
          "14:00-15:00": 2
        }
      }
    ],
    timeout: new Date(),
    results: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    options: [
      {
        date: "2024-03-01",
        // Invalid time slot format
        slots: {
          "14:00": 0,
          "25:00-26:00": 0
        }
      }
    ],
    timeout: new Date(),
    results: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    options: [
      {
        date: "2024-03-01",
        slots: {
          "14:00-15:00": 0
        }
      }
    ],
    timeout: new Date(),
    // Invalid results (less than minimum: 1)
    results: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    options: [
      {
        date: "2024-03-01",
        slots: {
          // Invalid slot vote number (negative)
          "14:00-15:00": -1
        }
      }
    ],
    timeout: new Date(),
    results: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    options: [
      {
        date: "2024-03-01", 
        slots: {
          "14:00-15:00": 1
        }
      }
    ],
    // Missing required date fields
    timeout: undefined,
    results: 1,
    createdAt: undefined,
    updatedAt: undefined
  }
]