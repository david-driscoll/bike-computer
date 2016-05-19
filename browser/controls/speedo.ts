import {style} from '../helpers';
const element = document.querySelector('speedo');

style(`
speedo {
    position: fixed !important;
    left: -20px;
    bottom: -16px;
}
`);

$(element).kendoRadialGauge({
    gaugeArea: {

    },
    name: 'speedo',
    pointer: [
        {
            color: 'white',
            value: 10,
            cap: {
                size: 0.15
            }
        }
    ],
    scale: {
        startAngle: 60,
        endAngle: 220,
        minorUnit: 1,
        majorUnit: 5,
        minorTicks: {
            width: 2
        },
        majorTicks: {
            width: 5
        },
        min: 0,
        max: 20,
        reverse: true,
        labels: {
            position: 'inside',
            font: 'bold 18px "Roboto"',
            color: '#CC2EFA'
        },
        rangePlaceholderColor: 'white',
        ranges: [
            {
                from: 0,
                to: 7,
                color: '#2EFEF7',
                opacity: 0.8
            }, {
                from: 7,
                to: 13,
                color: '#82FA58',
                opacity: 0.8
            }, {
                from: 13,
                to: 18,
                color: '#FFBF00',
                opacity: 0.8
            }, {
                from: 18,
                to: 25,
                color: '#FF0000',
                opacity: 0.8
            }
        ]
    }
});


