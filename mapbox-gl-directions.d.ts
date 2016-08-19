declare module MapBoxDirections {

    export let accessToken: string;

    export type Point = [number, number];
    export type Coordinates = LngLat[];

    export interface DirectionsOptions {
        container?: string | Element;
        unit: string | TextMetrics;
        profile: "driving" | "walking" | "cycling",
        proximity: Point
    }

    export interface Route {
        duration: number,
        distance: number,
        geometry: GeoJSON.LineString,
        legs: RouteLeg[]
    }

    export interface RouteLeg {
        distance: number,
        duration: number,
        steps: RouteStep[]
    }

    export interface RouteStep {
        distance: number,
        duration: number,
        geometry: GeoJSON.LineString,
        name: string,
        mode: DrivingMode | WalkingMode | CyclingMode
        maneuver: StepManeuver
    }

    export interface StepManeuver {
        location: LngLat,
        bearing_after: number,
        bearing_before: number,
        instruction: string,
        type: ManeuverTypes,
        pronunciation: string,
        intersections: Intersections[],
        exit: number
    }

    export interface Intersections {
        location: LngLat,
        bearings: number[],
        entry: [number, boolean][],
        in: number,
        out: number,
        lanes: Lane[]
    }

    export interface Lane {
        valid: boolean,
        indications: string[]
    }

    export enum DrivingMode {
        "driving",
        "ferry",
        "unaccessible"
    }

    export enum WalkingMode {
        "walking",
        "ferry",
        "unaccessible"
    }

    export enum CyclingMode {
        "cycling",
        "walking",
        "ferry",
        "train",
        "unaccessible"
    }

    export enum ManeuverTypes {
        "depart",
        "turn",
        "continue",
        "new name",
        "merge",
        "on ramp",
        "off ramp",
        "fork",
        "end of road",
        "roundabout",
        "roundabout turn",
        "notification",
        "arrive"
    }

    export enum ManeuverMode {
        "straight",
        "right",
        "slight right",
        "sharp right",
        "left",
        "slight left",
        "sharp left",
        "uturn"
    }

    export class LngLat {
        constructor(lng: number, lat: number);
        lng: number;
        lat: number;
        /** Return a new LngLat object whose longitude is wrapped to the range (-180, 180). */
        wrap(): LngLat;
        /** Return a LngLat as an array */
        toArray(): Point;
        /** Return a LngLat as a string */
        toString(): string;

        /** Convert an array to a LngLat object, or return an existing LngLat object unchanged. */
        static convert(lngLat: Array<number>): LngLat;
    }

    export class Directions extends MapBox.Control {

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

        setWaypoint(index: number, waypoint: Point): Directions;
    }
}