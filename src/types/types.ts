export type Airport = {
    iataCode: string
    name: string
    tzName: string
    popularity: number
}

export interface Duration {
    days: number;
    hours: number;
    minutes: number;
}
  
export interface Segment {
    origin: string;
    destination: string;
    departure_time: Date;
    arrival_time: Date;
    aircraft_type: string;
    flight_time: Duration;
    flight_num: string;
    layover: {
        layover_airport?: string;
        destination_airport?: string;
        start_time?: Date;
        end_time?: Date;
        duration?: Duration;
    } | null;
}

export interface Flight {
    carrier: string;
    origin: string;
    destination: string;
    departure_time: Date;
    arrival_time: Date;
    point_cost: number;
    dollar_cost: number;
    duration: Duration;
    cabin_class: string;
    segments: Segment[];
    stop_count: number;
    layover_duration: Duration;
    days_difference: number;
}