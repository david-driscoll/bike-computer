declare module MapBoxDirections {

    export let accessToken: string;

    export type Point = [number, number];

    export interface DirectionsOptions{
        container?: string | Element;
        unit: string | TextMetrics;
        profile: "walking" | "driving" | "cycling",
        proximity: Point
    }
    
    export class Directions extends MapBox.Control{

        constructor(options: DirectionsOptions);
        
        /** Adds a waypoint to the route.  Calling this method requires the map load event to have run. */
        addWaypoint(index: number, waypoint: Point): this;
        
        getDestination(): Point;
        
        getOrigin(): Point;
        
        getWaypoints(): Point[];
        
        removeWaypoint(index: number): Directions;
        
        revers(): Directions;
        
        setDestination(query: Point[]): Directions;
        
        setOrigin(query: Point[]): Directions;

        setWaypoint(index: number, waypoint:Point): Directions;
    }
}