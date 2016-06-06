declare module MapBox {
    export type Destination = [number, number];
    export type Origin = [number, number];
    
    export interface Directions{
        originPoint: Point;
        originLabel: string;
        destinationPoint: Point;
        destinationLabel: string;
        wayPoint: [Point];        
    }
    
    export interface Directions{
        /** HTML element to initialize the map */
        container?: string | Element;
        
        /** Adds a waypoint to the route.  Calling this method requires the map load event to have run. */
        addWaypoint(index: number, waypoint: Point): this;
        
        getDestination(): Point;
        
        getOrigin(): Point;
        
        getWaypoints(): Point[];
        
        removeWaypoint(index: number): this;
        
        revers(): this;
        
        setDestination(query: Point[]): this;
        
        setOrigin(query: Point[]): this;
    }
}