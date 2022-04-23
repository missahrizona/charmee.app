import * as d3 from 'd3';
import Gear from './gears.d3';

export default class GearSet {
  _gear = new Gear();
  _svg: any;
  _allGears: any[] = [];
  _randomiseInterval: any;
  _canvasWidth = 300;
  _canvasHeight = 700;
  _xOffset = this._canvasWidth * 0.5;
  _yOffset = this._canvasHeight * 0.4;
  _gearFactors = [64, 64, 32, 48, 48, 96, 112, 256];
  _gearStyles = ['style-0', 'style-1', 'style-2', 'style-3', 'style-4'];
  _autoShuffle = true;

  _options: any = {
    radius: 16,
    holeRadius: 0.4,
    transition: true,
    speed: 0.01,
    autoShuffle: true,
    number: 20,
    addendum: 8,
    dedendum: 3,
    thickness: 0.7,
    profileSlope: 0.5,
  };

  constructor(selector: string) {
    // set up our d3 svg element
    this._svg = d3
      .select(selector)
      .append('svg')
      .attr('viewBox', '0 0 ' + this._canvasWidth + ' ' + this._canvasHeight)
      .attr('preserveAspectRatio', 'xMinYMin slice');

    // generate and randomise scene
    this._generateScene(this._options);
    this._randomiseScene(false);

    // start a timer to randomise every few secs
    // _randomiseInterval = setInterval(function() {
    //   if (_autoShuffle)
    //     _randomiseScene(true);
    // }, 4000);

    // setTimeout(function() {
    //   _randomiseScene(true);
    // }, 100);

    // start the d3 animation timer
    d3.timer(
      function () {
        // @ts-ignore
        this._svg.selectAll('.gear-path').attr('transform', function (d: any) {
          d.angle += d.speed;
          return 'rotate(' + d.angle * (180 / Math.PI) + ')';
        });
      }.bind(this)
    );
  }

  _generateScene(options: any) {
    let holeRadius, teeth, radius, factor, newGear, innerRadius;

    this._gearStyles = this._gear.Utility.arrayShuffle(this._gearStyles);

    for (let i = 0; i < options.number; i++) {
      factor = this._gearFactors[i % this._gearFactors.length];
      radius = factor / 2;
      teeth = radius / 4;
      innerRadius = radius - options.addendum - options.dedendum;
      holeRadius =
        factor > 96
          ? innerRadius * 0.5 + innerRadius * 0.5 * options.holeRadius
          : innerRadius * options.holeRadius;

      let opts: any = {
        radius: radius,
        teeth: teeth,
        x: 0,
        y: 0,
        holeRadius: holeRadius,
        addendum: options.addendum,
        dedendum: options.dedendum,
        thickness: options.thickness,
        profileSlope: options.profileSlope,
      };

      this._allGears.push((newGear = this._gear.create(this._svg, opts)));

      newGear.classed(this._gearStyles[i % this._gearStyles.length], true);
    }
  }

  _randomiseScene(transition: any) {
    this._allGears = this._gear.Utility.arrayShuffle(this._allGears);
    this._gear.randomArrange(this._allGears, this._xOffset, this._yOffset);
    this._gear.setPower(this._allGears[0], 0.01);
    this._gear.updateGears(this._allGears);
    // elastic
    this._svg.selectAll('.gear').each(function (d: any, i: any) {
      if (transition) {
        // @ts-ignore
        d3.select(this)
          // @ts-ignore
          .transition()
          .ease((e) => {
            return 1;
          })
          // @ts-ignore
          .delay(i * 80 + Math.random() * 80)
          .duration(1500)
          .attr('transform', function (d: any) {
            // @ts-ignore
            return 'translate(' + [d.x, d.y] + ')';
          });
      } else {
        // @ts-ignore
        d3.select(this).attr('transform', function (d) {
          // @ts-ignore
          return 'translate(' + [d.x, d.y] + ')';
        });
      }
    });
  }
} // end class
