export enum UserRole {
    ADMIN = 0,
    MEMBER = 1
}

export enum AlarmInterval {
    MINUTE_1 = 0,
    MINUTE_5 = 1,
    MINUTE_10 = 2,
    MINUTE_15 = 3,
    MINUTE_30 = 4
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

export interface MessageResponse {
    message: string;
    error?: any;
    name?: string;
}