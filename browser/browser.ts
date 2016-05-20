// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
/// <reference path="../vendor/kendo/typescript/kendo.all.d.ts" />

import 'reflect-metadata';
require('zone.js');
//fixup lodash
const lodash = require('lodash');
lodash.default = lodash;
// fixup color
const color = require('color');
color.Color = color;
// fixup color
const angles = require('angles');
angles.default = angles;

import {bootstrap}    from '@angular/platform-browser-dynamic';
import {BikeComputerComponent} from './BikeComputerComponent';

bootstrap(BikeComputerComponent);
