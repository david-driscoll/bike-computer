declare module MapBox {
    //import GeoJSON = require('geojson');
    export let accessToken: string;

    export interface MapOptions {
        /** HTML element to initialize the map in (or element id as string) */
        container?: string | Element;
        /** Minimum zoom of the map */
        minZoom?: number;
        /** Maximum zoom of the map */
        maxZoom?: number;
        zoom?: number;
        center?: LngLat | LngLatArray;
        /** Map style. This must be an an object conforming to the schema described in the style reference , or a URL to a JSON style. To load a style from the Mapbox API, you can use a URL of the form  mapbox://styles/:owner/:style , where  :owner is your Mapbox account name and  :style is the style ID. Or you can use one of the predefined Mapbox styles . The Style URLs of the predefined Mapbox styles are:
        mapbox://styles/mapbox/streets-v9
        mapbox://styles/mapbox/outdoors-v9
        mapbox://styles/mapbox/light-v9
        mapbox://styles/mapbox/dark-v9
        mapbox://styles/mapbox/satellite-v9
        mapbox://styles/mapbox/satellite-streets-v9 */
        style?: Object | string;
        /** If  true , the map will track and update the page URL according to map position */
        hash?: boolean;
        /** If  false , no mouse, touch, or keyboard listeners are attached to the map, so it will not respond to input */
        interactive?: boolean;
        /** Snap to north threshold in degrees. */
        bearingSnap?: number;
        /** Style class names with which to initialize the map */
        classes?: string[];
        /** If  true , an attribution control will be added to the map. */
        attributionControl?: boolean;
        /** If  true , map creation will fail if the implementation determines that the performance of the created WebGL context would be dramatically lower than expected. */
        failIfMajorPerformanceCaveat?: boolean;
        /** If  true , The maps canvas can be exported to a PNG using map.getCanvas().toDataURL(); . This is false by default as a performance optimization. */
        preserveDrawingBuffer?: boolean;
        /** If set, the map is constrained to the given bounds. */
        maxBounds?: LngLatBounds | [Point, Point];
        /** If  true , enable the "scroll to zoom" interaction (see  ScrollZoomHandler ) */
        scrollZoom?: boolean;
        /** If  true , enable the "box zoom" interaction (see  BoxZoomHandler ) */
        boxZoom?: boolean;
        /** If  true , enable the "drag to rotate" interaction (see  DragRotateHandler ). */
        dragRotate?: boolean;
        /** If  true , enable the "drag to pan" interaction (see  DragPanHandler ). */
        dragPan?: boolean;
        /** If  true , enable keyboard shortcuts (see  KeyboardHandler ). */
        keyboard?: boolean;
        /** If  true , enable the "double click to zoom" interaction (see DoubleClickZoomHandler ). */
        doubleClickZoom?: boolean;
        /** If  true , enable the "pinch to rotate and zoom" interaction (see TouchZoomRotateHandler ). */
        touchZoomRotate?: boolean;
    }

    //export type AggergateFilter = "all" | "any" | "none";
    //export type InFilter = ["in" | "!in", string, ...any[]];
    export type ComparisonFilter = ["==" | "!=" | ">" | ">=" | "<" | "<=", string, any];
    export type HasFilter = ["has" | "!has", string];
    export type Filter = any[] | HasFilter | ComparisonFilter;

    export interface FilterOptions {
        /** Only query features from layers with these layer IDs. */
        layers?: Array<string>;
        /** A
        filter
        . */
        filter?: Filter;
    }

    export interface SourceOptions {
        sourceLayer?: string;
        /** A
        filter
        . */
        filter?: Filter;
    }

    export interface ZoomOptions {
        /** When true, the map transitions to the new camera using

        Map#easeTo
        . When false, the map transitions using
        Map#flyTo
        . See

        Map#flyTo
         for information on options specific to that animation transition. */
        linear?: boolean;
        /**  */
        easing?: Function;
        /** how much padding there is around the given bounds on each side in pixels */
        padding?: number;
        /** The resulting zoom level will be at most
        this value. */
        maxZoom?: number;
    }

    export interface ChangeOptions {
        /** Relative amount of zooming that takes place along the
        flight path. A high value maximizes zooming for an exaggerated animation, while a low
        value minimizes zooming for something closer to
        Map#easeTo
        . 1.42 is the average
        value selected by participants in the user study in

        van Wijk (2003)
        . A value of

        Math.pow(6, 0.25)
         would be equivalent to the root mean squared average velocity. A
        value of 1 would produce a circular motion. */
        curve?: number;
        /** Zero-based zoom level at the peak of the flight path. If

        options.curve
         is specified, this option is ignored. */
        minZoom?: number;
        /** Average speed of the animation. A speed of 1.2 means that
        the map appears to move along the flight path by 1.2 times
        options.curve
         screenfuls every
        second. A
        screenful
         is the visible span in pixels. It does not correspond to a fixed
        physical distance but rather varies by zoom level. */
        speed?: number;
        /** Average speed of the animation, measured in screenfuls
        per second, assuming a linear timing curve. If
        options.speed
         is specified, this option
        is ignored. */
        screenSpeed?: number;
        /** Transition timing curve */
        easing?: Function;
    }

    export interface PositionOptions {
        /** A string indicating the control's position on the map. Options are  top-right ,  top-left ,  bottom-right ,  bottom-left */
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    }

    export type Point = [number, number];
    export type LngLatArray = [number, number];
    export type LngLatBoundsArray = [Point, Point];
    export type Coordinates = [Point, Point, Point, Point];

    export interface GeoJSONSourceOptions {
        /** A GeoJSON data object or URL to it. The latter is preferable in case of large GeoJSON files. */
        data: GeoJSON.GeoJsonObject | string;
        /** Maximum zoom to preserve detail at. */
        maxzoom?: number;
        /** Tile buffer on each side in pixels. */
        buffer?: number;
        /** Simplification tolerance (higher means simpler) in pixels. */
        tolerance?: number;
        /** If the data is a collection of point features, setting this to true clusters the points by radius into groups. */
        cluster?: number;
        /** Radius of each cluster when clustering points, in pixels. */
        clusterRadius?: number;
        /** Max zoom to cluster points on. Defaults to one zoom less than  maxzoom (so that last zoom features are not clustered). */
        clusterMaxZoom?: number;
    }

    export class GeoJSONSource {
        constructor(options?: GeoJSONSourceOptions);
        setData(data: GeoJSON.GeoJsonObject): this;
    }

    export interface VideoSourceOptions {
        /** An array of URLs to video files */
        urls: Array<string>;
        /** Four geographical [lng, lat] LngLatBoundsArray in clockwise order defining the corners (starting with top left) of the video. Does not have to be a rectangle. */
        coordinates: LngLatBoundsArray;
    }

    export class VideoSource {
        constructor(options?: VideoSourceOptions);
        getVideo(): HTMLVideoElement;
        setCoordinates: Coordinates;
    }

    export interface ImageSourceOptions {
        /** A string URL of an image file */
        url: string;
        /** Four geographical [lng, lat] LngLatBoundsArray in clockwise order defining the corners (starting with top left) of the image. Does not have to be a rectangle. */
        coordinates: LngLatBoundsArray;
    }

    export class ImageSource {
        constructor(options?: ImageSourceOptions);
        setCoordinates: Coordinates;
    }

    export interface PopupOptions {
        /** whether to show a close button in the top right corner of the popup. */
        closeButton: boolean;
        /** whether to close the popup when the map is clicked. */
        closeOnClick: boolean;
        /** One of "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", or "bottom-right", describing where the popup's anchor relative to the coordinate set via setLngLat . */
        anchor: string;
    }

    export interface MapEventMethod {
        (type: string, listener: Function): this;
        (type: "webglcontextlost", listener: (e: Event) => void): this;
        (type: "webglcontextrestored", listener: (e: Event) => void): this;
        (type: "render", listener: () => void): this;
        (type: "touchend", listener: (e: TouchEvent) => void): this;
        (type: "movestart", listener: (e: Event) => void): this;
        (type: "move", listener: (e: Event) => void): this;
        (type: "moveend", listener: (e: Event) => void): this;
        (type: "touchstart", listener: (e: TouchEvent) => void): this;
        (type: "mouseup", listener: (e: MouseEvent) => void): this;
        (type: "mousemove", listener: (e: MouseEvent) => void): this;
        (type: "touchmove", listener: (e: TouchEvent) => void): this;
        (type: "mousedown", listener: (e: MouseEvent) => void): this;
        (type: "touchcancel", listener: (e: TouchEvent) => void): this;
        (type: "click", listener: (e: MouseEvent) => void): this;
        (type: "dblclick", listener: (e: MouseEvent) => void): this;
        (type: "contextmenu", listener: (e: EventData) => void): this;
        (type: "load", listener: () => void): this;
        (type: "zoomstart", listener: (e: EventData) => void): this;
        (type: "zoom", listener: (e: EventData) => void): this;
        (type: "zoomend", listener: (e: EventData) => void): this;
        (type: "boxzoomend", listener: (e: EventData) => void): this;
        (type: "boxzoomstart", listener: (e: EventData) => void): this;
        (type: "boxzoomcancel", listener: (e: EventData) => void): this;
        (type: "rotateend", listener: (e: EventData) => void): this;
        (type: "rotate", listener: (e: EventData) => void): this;
        (type: "rotatestart", listener: (e: EventData) => void): this;
        (type: "dragstart", listener: (e: EventData) => void): this;
        (type: "drag", listener: (e: EventData) => void): this;
        (type: "dragend", listener: (e: EventData) => void): this;
        (type: "pitch", listener: (e: EventData) => void): this;
    }

    export class Map {
        constructor(options: MapOptions);
        /** Adds a control to the map, calling control.addTo(this). */
        addControl(control: Control): this;
        /** Adds a style class to a map. */
        addClass(klass: string, options?: { transition: boolean; }): this;
        /** Removes a style class from a map. */
        removeClass(klass: string, options?: { transition: boolean; }): this;
        /** Helper method to add more than one class. */
        setClasses(klasses: Array<string>, options?: { transition: boolean; }): this;
        /** Check whether a style class is active. */
        hasClass(klass: string): boolean;
        /** Return an array of the current active style classes. */
        getClasses(): string[];
        /** Detect the map's new width and height and resize it. Given the container of the map specified in the Map constructor, this reads the new width from the DOM: so this method is often called after the map's container is resized by another script or the map is shown after being initially hidden with CSS. */
        resize(): this;
        /** Get the map's geographical bounds. */
        getBounds(): LngLatBounds;
        /** Set constraint on the map's geographical bounds. Pan or zoom operations that would result in displaying regions that fall outside of the bounds instead result in displaying the map at the closest point and/or zoom level of the requested operation that is within the max bounds. */
        setMaxBounds(lnglatbounds: LngLatBounds | LngLatBoundsArray): this;
        /** Set the map's minimum zoom level, and zooms map to that level if it is currently below it. If no parameter provided, unsets the current minimum zoom (sets it to 0) */
        setMinZoom(minZoom: number): Map;
        /** Set the map's maximum zoom level, and zooms map to that level if it is currently above it. If no parameter provided, unsets the current maximum zoom (sets it to 20) */
        setMaxZoom(maxZoom: number): this;
        /** Get pixel LngLatBoundsArray relative to the map container, given a geographical location. */
        project(lnglat: LngLat): { x: number; y: number; };
        /** Get geographical LngLatBoundsArray, given pixel LngLatBoundsArray. */
        unproject(point: Point): LngLat;
        /** Query rendered features at a point or within a rectangle. */
        queryRenderedFeatures(pointOrBox?: Point | LngLatBoundsArray, params?: FilterOptions): Array<Object>;
        /** Query data from vector tile or GeoJSON sources. */
        querySourceFeatures(sourceID: string, params?: { sourceLayer?: string; filter?: Filter; }): Array<Object>;
        /** Replaces the map's style object with a new value. Unlike the style option in the Map constructor, this method only accepts an object of a new style, not a URL string. */
        setStyle(style: Object): this;
        /** Get a style object that can be used to recreate the map's style. */
        getStyle(): Object;
        /** Add a source to the map style. */
        addSource(id: string, source: SourceInput): this;
        /** Remove an existing source from the map style. */
        removeSource(id: string): this;
        /** Return the style source object with the given id. */
        getSource<T extends SourceOutput>(id: string): T;
        /** Add a Mapbox GL style layer to the map. A layer references a source from which it pulls data and specifies styling for that data. */
        addLayer(layer: Layer, before?: string): this;
        /** Remove the layer with the given id from the map. Any layers which refer to the specified layer via a ref property are also removed. */
        removeLayer(id: string): this;
        /** Return the style layer object with the given id. */
        getLayer(id: string): void;
        /** Set the filter for a given style layer. */
        setFilter(layer: string, filter: Filter): this;
        /** Set the zoom extent for a given style layer. */
        setLayerZoomRange(layerId: string, minzoom: number, maxzoom: number): this;
        /** Get the filter for a given style layer. */
        getFilter(layer: string): Filter;
        /** Set the value of a paint property in a given style layer. */
        setPaintProperty(layer: string, name: string, value: any, klass?: string): this;
        /** Get the value of a paint property in a given style layer. */
        getPaintProperty(layer: string, name: string, klass?: string): any;
        /** Set the value of a layout property in a given style layer. */
        setLayoutProperty(layer: string, name: string, value: any): this;
        /** Get the value of a layout property in a given style layer. */
        getLayoutProperty(layer: string, name: string, klass?: string): any;
        /** Get the Map's container as an HTML element */
        getContainer(): HTMLElement;
        /** Get the container for the map canvas element. */
        getCanvasContainer(): HTMLElement;
        /** Get the Map's canvas as an HTML canvas */
        getCanvas(): HTMLElement;
        /** Is this map fully loaded? If the style isn't loaded or it has a change to the sources or style that isn't propagated to its style, return false. */
        loaded(): boolean;
        /** Destroys the map's underlying resources, including web workers and DOM elements. Afterwards, you must not call any further methods on this Map instance. */
        remove(): void;
        /** A default error handler for style.error, source.error, layer.error, and tile.error events. It logs the error via console.error. */
        onError(): void;
        /** Draw an outline around each rendered tile for debugging. */
        showTileBoundaries(): void;
        /** Draw boxes around all symbols in the data source, showing which were rendered and which were hidden due to collisions with other symbols for style debugging. */
        showCollisionBoxes(): void;
        /** Enable continuous repaint to analyze performance. */
        repaint(): void;
        /** Get the current view geographical point. */
        getCenter(): LngLat;
        /** Sets a map location. Equivalent to jumpTo({center: center}). */
        setCenter(center: LngLat, eventData?: EventData): this;
        /** Pan by a certain number of pixels */
        panBy(offset: Point, options?: AnimationOptions, eventData?: EventData): this;
        /** Pan to a certain location with easing */
        panTo(lnglat: LngLat, options?: AnimationOptions, eventData?: EventData): this;
        /** Get the current zoom */
        getZoom(): number;
        /** Sets a map zoom. Equivalent to jumpTo({zoom: zoom}). */
        setZoom(zoom: number, eventData?: EventData): this;
        /** Zooms to a certain zoom level with easing. */
        zoomTo(zoom: number, options?: AnimationOptions, eventData?: EventData): this;
        /** Zoom in by 1 level */
        zoomIn(options?: AnimationOptions, eventData?: EventData): this;
        /** Zoom out by 1 level */
        zoomOut(options?: AnimationOptions, eventData?: EventData): this;
        /** Get the current bearing in degrees */
        getBearing(): number;
        /** Sets a map rotation. Equivalent to jumpTo({bearing: bearing}). */
        setBearing(bearing: number, eventData?: EventData): this;
        /** Rotate bearing by a certain number of degrees with easing */
        rotateTo(bearing: number, options?: AnimationOptions, eventData?: EventData): this;
        /** Sets map bearing to 0 (north) with easing */
        resetNorth(options?: AnimationOptions, eventData?: EventData): this;
        /** Animates map bearing to 0 (north) if it's already close to it. */
        snapToNorth(options?: AnimationOptions, eventData?: EventData): this;
        /** Get the current angle in degrees */
        getPitch(): number;
        /** Sets a map angle. Equivalent to jumpTo({pitch: pitch}). */
        setPitch(pitch: number, eventData?: EventData): this;
        /** Zoom to contain certain geographical bounds */
        fitBounds(bounds: LngLatBounds | LngLatBoundsArray, options?: ZoomOptions, eventData?: EventData): this;
        /** Change any combination of center, zoom, bearing, and pitch, without a transition. The map will retain the current values for any options not included in options. */
        jumpTo(options: CameraOptions, eventData?: EventData): this;
        /** Change any combination of center, zoom, bearing, and pitch, with a smooth animation between old and new values. The map will retain the current values for any options not included in options. */
        easeTo(options: CameraOptions & AnimationOptions, eventData?: EventData): this;
        /** Change any combination of center, zoom, bearing, and pitch, animated along a curve that evokes flight. The transition animation seamlessly incorporates zooming and panning to help the user find his or her bearings even after traversing a great distance. */
        flyTo(options: CameraOptions & AnimationOptions, eventData?: EventData): this;
        /** Stop current animation */
        stop(): this;

        fire(type: string, data?: any): this;
        listens(type: string): boolean;
        off: MapEventMethod;
        on: MapEventMethod;
        once: MapEventMethod;
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

    export class LngLatBounds {
        constructor(sw: LngLat, ne: LngLat);
        /** Extend the bounds to include a given LngLat or LngLatBounds. */
        extend(obj: (LngLat | LngLatBounds)): this;
        /** Get the point equidistant from this box's corners */
        getCenter(): LngLat;
        /** Get southwest corner */
        getSouthWest(): LngLat;
        /** Get northeast corner */
        getNorthEast(): LngLat;
        /** Get northwest corner */
        getNorthWest(): LngLat;
        /** Get southeast corner */
        getSouthEast(): LngLat;
        /** Get west edge longitude */
        getWest(): number;
        /** Get south edge latitude */
        getSouth(): number;
        /** Get east edge longitude */
        getEast(): number;
        /** Get north edge latitude */
        getNorth(): number;
        /** Return a LngLatBounds as an array */
        toArray(): LngLatBoundsArray;
        /** Return a LngLatBounds as a string */
        toString(): string;

        /** Convert an array to a LngLatBounds object, or return an existing LngLatBounds object unchanged. */
        static convert(input: LngLatBounds | Array<number> | Array<Array<number>>): LngLatBounds;
    }

    export abstract class Control {
        constructor();
        /** Add this control to the map, returning the control itself for chaining. This will insert the control's DOM element into the map's DOM element if the control has a position specified. */
        addTo(map: Map): this;
        /** Remove this control from the map it has been added to. */
        remove(): this;
    }

    export class BoxZoomHandler {
        /** Returns the current enabled/disabled state of the "box zoom" interaction. */
        isEnabled(): boolean;
        /** Returns true if the "box zoom" interaction is currently active, i.e. currently being used. */
        isActive(): boolean;
        /** Enable the "box zoom" interaction. */
        enable(): void;
        /** Disable the "box zoom" interaction. */
        disable(): void;
    }

    export class ScrollZoomHandler {
        /** Returns the current enabled/disabled state of the "scroll to zoom" interaction. */
        isEnabled(): boolean;
        /** Enable the "scroll to zoom" interaction. */
        enable(): void;
        /** Disable the "scroll to zoom" interaction. */
        disable(): void;
    }

    export class DragPanHandler {
        /** Returns the current enabled/disabled state of the "drag to pan" interaction. */
        isEnabled(): boolean;
        /** Returns true if the "drag to pan" interaction is currently active, i.e. currently being used. */
        isActive(): boolean;
        /** Enable the "drag to pan" interaction. */
        enable(): void;
        /** Disable the "drag to pan" interaction. */
        disable(): void;
    }

    export class DragRotateHandler {
        /** Returns the current enabled/disabled state of the "drag to rotate" interaction. */
        isEnabled(): boolean;
        /** Returns true if the "drag to rotate" interaction is currently active, i.e. currently being used. */
        isActive(): boolean;
        /** Enable the "drag to rotate" interaction. */
        enable(): void;
        /** Disable the "drag to rotate" interaction. */
        disable(): void;
    }

    export class KeyboardHandler {
        /** Returns the current enabled/disabled state of keyboard interaction. */
        isEnabled(): boolean;
        /** Enable the ability to interact with the map using keyboard input. */
        enable(): void;
        /** Disable the ability to interact with the map using keyboard input. */
        disable(): void;
    }

    export class DoubleClickZoomHandler {
        /** Returns the current enabled/disabled state of the "double click to zoom" interaction. */
        isEnabled(): boolean;
        /** Enable the "double click to zoom" interaction. */
        enable(): void;
        /** Disable the "double click to zoom" interaction. */
        disable(): void;
    }

    export class TouchZoomRotateHandler {
        /** Returns the current enabled/disabled state of the "pinch to rotate and zoom" interaction. */
        isEnabled(): boolean;
        /** Enable the "pinch to rotate and zoom" interaction. */
        enable(): void;
        /** Disable the "pinch to rotate and zoom" interaction. */
        disable(): void;
        /** Disable the "pinch to rotate" interaction, leaving the "pinch to zoom" interaction enabled. */
        disableRotation(): void;
        /** Enable the "pinch to rotate" interaction, undoing a call to disableRotation. */
        enableRotation(): void;
    }

    export class Popup {
        constructor(options: PopupOptions);
        /** Attaches the popup to a map */
        addTo(map: Map): this;
        /** Removes the popup from a map */
        remove(): this;
        /** Get the popup's geographical location */
        getLngLat(): LngLat;
        /** Set the popup's geographical position and move it. */
        setLngLat(lnglat: LngLat): this;
        /** Fill a popup element with text only content. This creates a text node in the DOM, so it cannot end up appending raw HTML. Use this method if you want an added level of security against XSS if the popup content is user-provided. */
        setText(text: string): this;
        /** Fill a popup element with HTML content, provided as a string. */
        setHTML(html: string): this;
        /** Fill a popup element with DOM content */
        setDOMContent(htmlNode: Node): this;
    }

    export type SourceOutput = GeoJSONSource | ImageSource | VideoSource;
    export type SourceInput = VectorSource | RasterSourceInput | GeoJSONSourceInput | ImageSourceInput | VideoSourceInput | SourceOutput;

    /** TODO: Should be a class */
    interface VectorSource {
        type: "vector";
        url: string;
    }

    /** TODO: Should be a class */
    interface RasterSourceInput {
        type: "raster";
        url: string;
        tileSize: number
    }

    interface GeoJSONSourceInput {
        type: "geojson";
        data: GeoJSON.GeoJsonObject;
    }

    /** TODO: Should be a class */
    interface ImageSourceInput {
        type: "image";
        url: string;
        coordinates: LngLatBoundsArray
    }

    interface VideoSourceInput {
        type: "video";
        urls: Array<string>;
        coordinates: LngLatBoundsArray
    }

    export type Layer = BackgroundLayer | FillLayer | LineLayer | SymbolLayer | RasterLayer | CircleLayer;

    interface CommonLayer {
        id: string;
        metadata?: { [index: string]: any; }
        ref?: string;
        source: string;
        "source-layer"?: string;
        minzoom?: number;
        maxzoom?: number;
        interactive?: boolean;
        filter?: Filter;
        //paint.*
        [index: string]: any;
    }

    interface CommonLayout {
        visibility?: "visible" | "none";
    }

    interface BackgroundLayer extends CommonLayer {
        type: "background";
        layout?: CommonLayer;
        paint?: BackgroundPaint;
    }

    interface BackgroundPaint {
        "background-color"?: string;
        "background-pattern"?: string;
        "background-opacity"?: number;
    }

    interface FillLayer extends CommonLayer {
        type: "fill";
        layout?: CommonLayer;
        paint?: FillPaint;
    }

    interface FillPaint {
        "fill-antialias"?: boolean;
        "fill-opacity"?: number;
        "fill-color"?: string;
        "fill-outline-color": string;
        "fill-translate"?: Array<number>;
        "fill-translate-anchor"?: "map" | "viewport";
        "fill-pattern"?: "string";
    }

    interface LineLayer extends CommonLayer {
        type: "line";
        layout?: LineLayout;
        paint?: LinePaint;
    }

    interface LineLayout extends CommonLayout {
        "line-cap"?: "butt" | "round" | "square" | string;
        "line-join"?: "bevel" | "round" | "miter" | string;
        "line-miter-limit"?: number;
        "line-round-limit"?: number;
    }

    interface LinePaint {
        "line-opacity"?: number;
        "line-color"?: string;
        "line-translate"?: Array<number>;
        "line-translate-anchor"?: "map" | "viewport";
        "line-width"?: number;
        "line-gap-width"?: number;
        "line-offset"?: number;
        "line-blur"?: number;
        "line-dasharray"?: Array<number>;
        "line-pattern"?: string;
    }

    interface SymbolLayer extends CommonLayer {
        type: "symbol";
        layout?: SymbolLayout;
        paint?: SymbolPaint;
    }

    interface SymbolLayout extends CommonLayout {
        "symbol-placement"?: "point" | "line";
        "symbol-spacing"?: number;
        "symbol-avoid-edges"?: boolean;
        "icon-allow-overlap"?: boolean;
        "icon-ignore-placement"?: boolean;
        "icon-optional"?: boolean;
        "icon-rotation-alignment"?: "map" | "viewport";
        "icon-size"?: number;
        "icon-image"?: string;
        "icon-rotate"?: number;
        "icon-padding"?: number;
        "icon-keep-upright"?: boolean;
        "icon-offset"?: Array<number>;
        "text-rotation-alignment"?: "map" | "viewport";
        "text-field"?: string;
        "text-font"?: string;
        "text-size"?: number;
        "text-max-width"?: number;
        "text-line-height"?: number;
        "text-letter-spacing"?: number;
        "text-justify"?: "left" | "center" | "right";
        "text-anchor"?: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
        "text-max-angle"?: number;
        "text-rotate"?: number;
        "text-padding"?: number;
        "text-keep-upright"?: boolean;
        "text-transform"?: "none" | "uppercase" | "lowercase";
        "text-offset"?: Array<number>;
        "text-allow-overlap"?: boolean;
        "text-ignore-placement"?: boolean;
        "text-optional"?: boolean;
    }

    interface SymbolPaint {
        "icon-opacity"?: number;
        "icon-color"?: string;
        "icon-halo-color"?: string;
        "icon-halo-width"?: number;
        "icon-halo-blur"?: number;
        "icon-translate"?: Array<number>;
        "icon-translate-anchor"?: "map" | "viewport";
        "text-opacity"?: number;
        "text-color"?: "string";
        "text-halo-color"?: "string";
        "text-halo-width"?: number;
        "text-halo-blur"?: number;
        "text-translate"?: Array<number>;
        "text-translate-anchor"?: "map" | "viewport";
    }

    interface RasterLayer extends CommonLayer {
        type: "raster";
        layout?: CommonLayout;
        paint?: RasterPaint;
    }

    interface RasterPaint {
        "raster-opacity"?: number;
        "raster-hue-rotate"?: number;
        "raster-brightness-min"?: number;
        "raster-brightness-max"?: number;
        "raster-saturation"?: number;
        "raster-contrast"?: number;
        "raster-fade-duration"?: number;
    }

    interface CircleLayer extends CommonLayer {
        type: "circle";
        layout?: CommonLayout;
        paint?: CirclePaint;
    }

    interface CirclePaint {
        "circle-radius"?: number;
        "circle-color"?: string;
        "circle-blur"?: number;
        "circle-opacity"?: number;
        "circle-translate"?: [number, number];
        "circle-translate-anchor"?: "map" | "viewport";
    }

    class Geolocate extends Control {
        constructor(options: {
            position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
        });
    }

    interface EventData {
        originalEvent?: Event;
        point?: Array<number>;
        lngLat?: LngLat;
    }

    interface CameraOptions {
        /** Map center */
        center?: LngLat;
        /** Map zoom level */
        zoom?: number;
        /** Map rotation bearing in degrees counter-clockwise from north */
        bearing?: number;
        /** Map angle in degrees at which the camera is looking at the ground */
        pitch?: number;
        /** If zooming, the zoom center (defaults to map center) */
        around?: LngLat;
    }

    interface AnimationOptions {
        /** Number in milliseconds */
        duration?: number;
        easing?: Function;
        /** point, origin of movement relative to map center */
        offset?: Array<number>;
        /** When set to false, no animation happens */
        animate?: boolean;
    }

    export interface StyleSpec {
        version: number;
        name: string;
        metadata: { [index: string]: any; };
        center: LngLat;
        zoom: number;
        bearing: number;
        pitch: number;
        sources: SourceInput[];
        sprite: string;
        glyphs: string;
        transition: { duration: number; delay: number; };
        layers: Layer[];
    }
}
