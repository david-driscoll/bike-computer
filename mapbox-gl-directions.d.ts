declare module MapBox {

    export type Directions={
        originPoint: Point;
        originQuery: string;
        originLabel: string;
        destinationPoint: Point;
        destinationQuery: string;
        destinationLabel: string;
        wayPoint: Point[];        
    }

    export interface DirectionsOptions{
        container?: string | Element;
        unit: string | TextMetrics;
        profile: "walking" | "driving" | "cycling"
    }
    
    export interface DirectionsApi{
        /** HTML element to initialize the map */
        container?: string | Element;
        
        directions: Directions;

        constructor(options: DirectionsOptions): Directions;
        
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