declare namespace openweathermap {
    export interface Forecast5 {
        city: Forecast5.City;
    }
    namespace Forecast5 {
        export interface Coord {
            lon: number;
            lat: number;
        }

        export interface Main {
            temp: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            sea_level: number;
            grnd_level: number;
            humidity: number;
            temp_kf: number;
        }

        export interface Weather {
            id: number;
            main: string;
            description: string;
            icon: string;
        }

        export interface Clouds {
            all: number;
        }

        export interface Wind {
            speed: number;
            deg: number;
        }

        export interface Sys {
            pod: string;
        }

        export interface List {
            dt: number;
            main: Main;
            weather: Weather[];
            clouds: Clouds;
            wind: Wind;
            sys: Sys;
            dt_txt: string;
        }

        export interface City {
            id: number;
            name: string;
            coord: Coord;
            country: string;
            cod: string;
            message: number;
            cnt: number;
            list: List[];
        }
    }

    export interface Current {
        coord: Current.Coord;
        weather: Current.Weather[];
        base: string;
        main: Current.Main;
        wind: Current.Wind;
        clouds: Current.Clouds;
        rain: Current.Rain;
        dt: number;
        sys: Current.Sys;
        id: number;
        name: string;
        cod: number;
    }

    namespace Current {
        export interface Coord {
            lon: number;
            lat: number;
        }

        export interface Weather {
            id: number;
            main: string;
            description: string;
            icon: string;
        }

        export interface Main {
            temp: number;
            pressure: number;
            humidity: number;
            temp_min: number;
            temp_max: number;
        }

        export interface Wind {
            speed: number;
            deg: number;
        }

        export interface Clouds {
            all: number;
        }

        export interface Rain {
            "3h": number;
        }

        export interface Sys {
            type: number;
            id: number;
            message: number;
            country: string;
            sunrise: number;
            sunset: number;
        }


    }

}
