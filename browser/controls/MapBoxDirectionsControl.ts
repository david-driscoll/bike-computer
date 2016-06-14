import {Component, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import _ from 'lodash';
import {DisposableComponent, CompositeDisposable} from '../../helpers/disposables';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
import {LocationService} from '../../services/LocationService';
import {PathService} from '../../services/PathService';
import angles from 'angles';

const directions: typeof MapBoxDirections = require('../../node_modules/mapbox-gl-directions/src/directions.js');
var {Directions} = directions;

const apiKey: string = require('../../vendor/maps-api-key.json').mapbox;