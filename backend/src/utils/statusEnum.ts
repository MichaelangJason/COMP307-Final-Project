export enum UserRole {
  ADMIN = 0,
  MEMBER = 1
}

export enum AlarmInterval {
  MINUTE_1 = 1,
  MINUTE_5 = 5,
  MINUTE_10 = 10,
  MINUTE_15 = 15,
  MINUTE_30 = 30
}

export enum RequestStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DECLINED = 2,   
  EXPIRED = 3
}

export enum MeetingStatus {
  UPCOMING = 0,
  CLOSED = 1,
  CANCELED = 2,
  VOTING = 3
}

export enum MeetingRepeat {
  ONCE = 0,
  WEEKLY = 1
}