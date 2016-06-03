declare module MapBoxDirections {
    export let accessToken: string;
    
    export type WayPoint = [number, number];
    export type Destination = [number, number];
    export type Origin = [number, number];
    export type Coordinates = [WayPoint];
    
    export interface Directions{
        originPoint: MapBoxDirections.WayPoint;
        originLabel: string;
        destinationPoint: MapBoxDirections.WayPoint;
        destinationLabel: string;
        wayPoint: MapBoxDirections.WayPoint;        
    }
    
    export interface MapDirections{
        /** HTML element to initialize the map */
        container?: string | Element;
        
        /** Adds a waypoint to the route.  Calling this method requires the map load event to have run. */
        addWaypoint(index: number, waypoint: WayPoint): this;
        
        getDestination(): Destination;
        
        getOrigin(): Origin;
        
        getWaypoints(): WayPoint[];
        
        removeWaypoint(index: number): this;
        
        revers(): this;
        
        setDestination(query: WayPoint[]): this;
        
        setOrigin(query: WayPoint[]): this;
    }
}