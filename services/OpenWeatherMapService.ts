import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import _ from 'lodash';
import {ConnectionService} from './ConnectionService';
import {LocationService, LngLatArray} from './LocationService';

const apiKey: string = require('../vendor/maps-api-key.json').openweathermap;

@Injectable()
export class OpenWeatherMapService {
    private _current: Observable<openweathermap.Current>;
    private _forecast: Observable<openweathermap.Forecast5>;
    constructor(private http: Http, private connection: ConnectionService, private location: LocationService) {
        const timeToQuery = Observable.combineLatest(connection.online, location.current, (online, location) => ({ online, location }))
            .filter(x => x.online)
            .throttleTime(1000 * 60 * 10)
            .map(x => x.location)
            .share();

        this._current = timeToQuery
            .switchMap((location) => this._queryCurrent(location))
            .cache(1);

        this._forecast = timeToQuery
            .switchMap((location) => this._queryForecast(location))
            .cache(1);
    }

    private _queryCurrent([lng, lat]: LngLatArray) {
        return this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`)
            .retry(3)
            .map<openweathermap.Current>(x => x.json());
    }

    private _queryForecast([lng, lat]: LngLatArray) {
        return this.http.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}`)
            .retry(3)
            .map<openweathermap.Forecast5>(x => x.json());
    }

    public get current() { return this._current; }
    public get forecast() { return this._forecast; }
}

export const WeatherCode = _.invert<{ [index: number]: string; }>({
    'thunderstorm with light rain': [200],
    'thunderstorm with rain': [201],
    'thunderstorm with heavy rain': [202],
    'light thunderstorm': [210],
    'thunderstorm': [211],
    'heavy thunderstorm': [212],
    'ragged thunderstorm': [221],
    'thunderstorm with light drizzle': [230],
    'thunderstorm with drizzle': [231],
    'thunderstorm with heavy drizzle': [232],
    'light intensity drizzle': [300],
    'drizzle': [301],
    'heavy intensity drizzle': [302],
    'light intensity drizzle rain': [310],
    'drizzle rain': [311],
    'heavy intensity drizzle rain': [312],
    'shower rain and drizzle': [313],
    'heavy shower rain and drizzle': [314],
    'shower drizzle': [321],
    'light rain': [500],
    'moderate rain': [501],
    'heavy intensity rain': [502],
    'very heavy rain': [503],
    'extreme rain': [504],
    'freezing rain': [511],
    'light intensity shower rain': [520],
    'shower rain': [521],
    'heavy intensity shower rain': [522],
    'ragged shower rain': [531],
    'light snow': [600],
    'snow': [601],
    'heavy snow': [602],
    'sleet': [611],
    'shower sleet': [612],
    'light rain and snow': [615],
    'rain and snow': [616],
    'light shower snow': [620],
    'shower snow': [621],
    'heavy shower snow': [622],
    'mist': [701],
    'smoke': [711],
    'haze': [721],
    'sand dust whirls': [731],
    'fog': [741],
    'sand': [751],
    'dust': [761],
    'volcanic ash': [762],
    'squalls': [771],
    'clear sky': [800],
    'few clouds': [801],
    'scattered clouds': [802],
    'broken clouds': [803],
    'overcast clouds': [804],
    'tropical storm': [901],
    'cold': [903],
    'hot': [904],
    'windy': [905],
    'hail': [906],
    'calm': [951],
    'light breeze': [952],
    'gentle breeze': [953],
    'moderate breeze': [954],
    'fresh breeze': [955],
    'strong breeze': [956],
    'high wind near gale': [957],
    'gale': [958],
    'severe gale': [959],
    'storm': [960],
    'violent storm': [961],
    'tornado': [781, 900],
    'hurricane': [902, 962]
});
