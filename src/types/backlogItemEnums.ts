export enum BacklogItemStatus {
    None = 0,
    NotStarted = 1, // DB: null
    InProgress = 2, // DB: 'P' = in progress
    Done = 3, // DB: 'D' = done
    Accepted = 4, // DB: 'A' = accepted
    Released = 5 // DB: 'R' = released
}
