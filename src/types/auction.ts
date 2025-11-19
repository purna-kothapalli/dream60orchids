// This is the correct, specific type for status
type BoxStatus = "completed" | "upcoming" | "active";

// Define your base Box type
export interface Box {
    id: number;
    type: 'round' | 'prize'; // Or other types
    status?: BoxStatus;
    // ... other common properties
}

// Define your specific box types
export interface RoundBox extends Box {
    type: 'round';
    roundNumber: number;
    minBid: number;
    currentBid: number;
    bidder: string;
    leaderboard?: Array<{
        username: string;
        bid: number;
        timestamp: Date;
    }>;
}

export interface PrizeBox extends Box {
    type: 'prize';
    prizeName: string;
    prizeImage: string;
}

// A union type for any kind of box
export type AnyBox = RoundBox | PrizeBox;

// Define your main Auction type
export interface Auction {
    id: string;
    boxes: AnyBox[]; // Use the union type here
    prizeValue: number;
    userBidsPerRound?: { [roundNumber: number]: number };
    userHasPaidEntry?: boolean;
}

// Define your User type
export interface User {
    username: string;
    // ... other user properties
}