/**
 * gears.d3.js
 * http://brm.io/gears-d3-js/
 * License: MIT
 */
import * as d3 from 'd3';

//@ts-ignore

export default class Gear {
  nextGearId = 0;

  create(
    svg: {
      append: (arg0: string) => {
        (): any;
        new (): any;
        attr: {
          (arg0: string, arg1: string): {
            (): any;
            new (): any;
            attr: {
              (arg0: string, arg1: string): {
                (): any;
                new (): any;
                datum: {
                  (arg0: {
                    teeth: number;
                    radius: any;
                    x: any;
                    y: any;
                    speed: any;
                    power: any;
                    angle: any;
                    addendum: any;
                    dedendum: any;
                    thickness: any;
                    profileSlope: any;
                    holeRadius: any;
                    dragEvent: string;
                    id: any;
                  }): any;
                  new (): any;
                };
              };
              new (): any;
            };
          };
          new (): any;
        };
      };
    },
    options: {
      teeth: number;
      radius: any;
      x: any;
      y: any;
      power: any;
      angle: any;
      addendum: any;
      dedendum: any;
      thickness: any;
      profileSlope: any;
      holeRadius: any;
    }
  ) {
    var datum: any = {
      teeth: Math.round(options.teeth) || 16,
      radius: options.radius || 200,
      x: options.x || 0,
      y: options.y || 0,
      speed: options.power || 0,
      power: options.power || 0,
      angle: options.angle || 0,
      addendum: options.addendum || 8,
      dedendum: options.dedendum || 3,
      thickness: options.thickness || 0.7,
      profileSlope: options.profileSlope || 0.5,
      holeRadius: options.holeRadius || 5,
      dragEvent: 'dragend',
      id: this.nextGearId,
    };

    this.nextGearId += 1;

    datum.rootRadius = datum.radius - datum.dedendum;
    datum.outsideRadius = datum.radius + datum.addendum;
    datum.circularPitch = ((1 - datum.thickness) * 2 * Math.PI) / datum.teeth;
    datum.pitchAngle = (datum.thickness * 2 * Math.PI) / datum.teeth;
    datum.slopeAngle = datum.pitchAngle * datum.profileSlope * 0.5;
    datum.addendumAngle = datum.pitchAngle * (1 - datum.profileSlope);

    var gear = svg
      .append('g')
      .attr('class', 'gear')
      .attr('transform', 'translate(' + datum.x + ', ' + datum.y + ')')
      .datum(datum);

    gear.on('mouseover', () => {
      // @ts-ignore
      var $this = d3.select(this);
      $this.attr('transform', $this.attr('transform') + ' scale(1.06)');
    });

    gear.on('mouseout', () => {
      // @ts-ignore
      var $this = d3.select(this);
      $this.attr(
        'transform',
        $this.attr('transform').replace(' scale(1.06)', '')
      );
    });

    gear.append('path').attr('class', 'gear-path').attr('d', this.path);

    return gear;
  }

  setPower(
    gear: { datum: () => { (): any; new (): any; power: any } },
    power: any
  ) {
    gear.datum().power = power;
  }

  randomArrange(
    gears: any,
    xOffset: number,
    yOffset: number,
    angleMin?: number,
    angleMax?: number
  ) {
    var xx = xOffset || 0,
      yy = yOffset || 0,
      angle = 0,
      prevGear,
      nextGear,
      distance,
      collision: any = false,
      unplacedGears,
      placedGears = [],
      randomPlaced,
      placed;

    // params
    angleMin = angleMin || 0.9;
    angleMax = angleMax || 1.2;

    // first clone and shuffle all the gears
    unplacedGears = this.Utility.arrayClone(gears);
    this.Utility.arrayShuffle(unplacedGears);

    // place the first gear
    unplacedGears[0].datum().x = xx;
    unplacedGears[0].datum().y = yy;
    placedGears.push(unplacedGears[0]);

    // try place the gears randomly
    // this is a bit hit and miss... but it mostly works

    // for every other gear
    for (var i = 1; i < unplacedGears.length; i++) {
      nextGear = unplacedGears[i].datum();
      randomPlaced = Math.floor(Math.random() * placedGears.length);
      placed = false;
      collision = 2;
      nextGear.power = 0;

      // try mesh to each placed gear until find one that works
      for (var j = 0; j < placedGears.length; j += 1) {
        if (placed === true) break;

        // get the gear in question and find potential position to test
        prevGear = placedGears[(randomPlaced + j) % placedGears.length].datum();
        distance = prevGear.radius + nextGear.radius - nextGear.addendum;
        angle = Math.random() * 2 * Math.PI;

        // try at angular intervals around the gear in question
        // until we find an empty spot where we can place the gear (no collisions)
        for (var k = 0; k < 2 * Math.PI; k += 0.5) {
          if (placed === true) break;

          nextGear.x = prevGear.x + Math.cos(angle + k) * distance;
          nextGear.y = prevGear.y + Math.sin(angle + k) * distance;
          collision = this.anyGearCollides(nextGear, placedGears, 10);

          if (collision <= 1) {
            this.mesh(prevGear, nextGear);
            placedGears.push(unplacedGears[i]);
            placed = true;
          }
        }
      }

      // the above may fail on rare occasion
      // can't fit so ditch it!
      if (placed !== true) {
        nextGear.x = -100;
        nextGear.y = -100;
      }
    }
  }

  dragBehaviour(gears: any, svg: any) {
    // @ts-ignore
    return (
      d3
        .drag()
        // @ts-ignore
        .origin(function (d: any) {
          return d;
        })
        .on('dragstart', (d: { dragEvent: string }, i: any) => {
          d.dragEvent = 'dragstart';
          // @ts-ignore
          d3.select(this).classed('dragging', true);
          d3.select('body').classed('dragging', true);
        })
        .on(
          'drag',
          (
            event: any,
            d: { x: number; y: number; radius: number; dragEvent: string },
            i: any
          ) => {
            var collision: any = false,
              oldX = d.x,
              oldY = d.y;

            d.x = event.x;
            d.y = event.y;
            d.x = Math.max(d.radius, d.x);
            d.y = Math.max(d.radius, d.y);

            d.dragEvent = 'drag';
            // @ts-ignore
            collision = this.anyGearCollides(d3.select(this).datum(), gears);

            if (!collision) {
              // @ts-ignore
              d3.select(this).attr('transform', (d: any, i: any) => {
                return 'translate(' + [d.x, d.y] + ')';
              });

              this.updateGears(gears);
            } else {
              d.x = oldX;
              d.y = oldY;
            }
          }
        )
        .on('dragend', (d: { dragEvent: string }, i: any) => {
          d.dragEvent = 'dragend';
          // @ts-ignore
          d3.select(this).classed('dragging', false);
          d3.select('body').classed('dragging', false);
          this.updateGears(gears);
        })
    );
  }

  anyGearCollides(gearA: any, gears: string | any[], tolerance?: number) {
    var collisions = 0;
    tolerance = tolerance || 0;

    for (var i = 0; i < gears.length; i++) {
      var gearB = gears[i];

      if (this.gearCollides(gearA, gearB.datum(), tolerance)) collisions += 1;
    }

    return collisions;
  }

  gearCollides(
    gearA: { radius: any; addendum: number; id: any; x: number; y: number },
    gearB: { radius: any; addendum: number; id: any; x: number; y: number },
    tolerance: number
  ) {
    var threshold =
      gearA.radius +
      gearB.radius -
      Math.max(gearA.addendum, gearB.addendum) +
      tolerance;
    tolerance = tolerance || 0;

    if (
      gearA.id === gearB.id ||
      Math.abs(gearA.x - gearB.x) > threshold ||
      Math.abs(gearA.y - gearB.y) > threshold
    )
      return false;

    if (
      this.Utility.distanceSquared(gearA.x, gearA.y, gearB.x, gearB.y) <
      threshold * threshold
    )
      return true;

    return false;
  }

  propagateGears(
    gear: { connected: any; id: string | number; speed: number; teeth: number },
    visited: { [x: string]: boolean }
  ) {
    var connected = gear.connected;

    visited = visited || {};
    visited[gear.id] = true;

    for (var nextGearId in connected) {
      if (connected.hasOwnProperty(nextGearId)) {
        var nextGear = connected[nextGearId];

        if (nextGear.id === gear.id || nextGear.id in visited) continue;

        visited[nextGear.id] = true;

        nextGear.speed -= gear.speed * (gear.teeth / nextGear.teeth);

        this.propagateGears(nextGear, visited);
      }
    }
  }

  updateGears(gears: string | any[]) {
    var gearA, gearB, datum;

    for (var i = 0; i < gears.length; i += 1) {
      datum = gears[i].datum();
      datum.connected = {};
      datum.speed = datum.power;
    }

    for (i = 0; i < gears.length; i += 1) {
      for (var j = i + 1; j < gears.length; j += 1) {
        gearA = gears[i];
        gearB = gears[j];

        var datumA = gearA.datum(),
          datumB = gearB.datum(),
          collides = this.gearCollides(
            datumA,
            datumB,
            Math.max(datumA.addendum, +datumB.addendum)
          );

        if (collides) {
          datumA.connected[datumB.id] = datumB;
          datumB.connected[datumA.id] = datumA;
        }
      }
    }

    for (i = 0; i < gears.length; i += 1) {
      gearA = gears[i];

      if (!gearA.classed('dragging')) continue;

      var nextGear = gearA.datum(),
        connectedKeys = this.Utility.keys(nextGear.connected);

      if (connectedKeys.length === 0) continue;

      var gear = nextGear.connected[connectedKeys[0]];

      this.mesh(gear, nextGear);
    }

    var visited = {};

    for (i = 0; i < gears.length; i += 1) {
      datum = gears[i].datum();

      if (Math.abs(datum.power) > 0) {
        this.propagateGears(datum, visited);
        gears[i].classed('powered', true);
      } else {
        gears[i].classed('powered', false);
      }
    }

    for (i = 0; i < gears.length; i += 1) {
      datum = gears[i].datum();
      if (Math.abs(datum.speed) > 0) {
        gears[i].classed('moving', true);
      } else {
        gears[i].classed('moving', false);
      }
    }
  }

  mesh(
    gear: { x: any; y: any; radius: number; angle: number },
    nextGear: {
      x: any;
      y: any;
      circularPitch: number;
      slopeAngle: number;
      addendumAngle: any;
      radius: number;
      angle: any;
    }
  ) {
    var theta = this.Utility.angle(gear.x, gear.y, nextGear.x, nextGear.y),
      pitch =
        nextGear.circularPitch +
        nextGear.slopeAngle * 2 +
        nextGear.addendumAngle,
      radiusRatio = gear.radius / nextGear.radius;
    nextGear.angle =
      -(gear.angle % (2 * Math.PI)) * radiusRatio +
      theta +
      theta * radiusRatio +
      pitch * 0.5;
  }

  path(options: {
    addendum: any;
    dedendum: any;
    thickness: any;
    profileSlope: any;
    holeRadius: any;
    teeth: any;
    radius: number;
  }) {
    var addendum = options.addendum,
      dedendum = options.dedendum,
      thickness = options.thickness,
      profileSlope = options.profileSlope,
      holeRadius = options.holeRadius,
      teeth = options.teeth,
      radius = options.radius - addendum,
      rootRadius = radius - dedendum,
      outsideRadius = radius + addendum,
      circularPitch = ((1 - thickness) * 2 * Math.PI) / teeth,
      pitchAngle = (thickness * 2 * Math.PI) / teeth,
      slopeAngle = pitchAngle * profileSlope * 0.5,
      addendumAngle = pitchAngle * (1 - profileSlope),
      theta = addendumAngle * 0.5 + slopeAngle,
      path = [
        'M',
        rootRadius * Math.cos(theta),
        ',',
        rootRadius * Math.sin(theta),
      ];

    for (var i = 0; i < teeth; i++) {
      theta += circularPitch;

      path.push(
        'A',
        rootRadius,
        ',',
        rootRadius,
        ' 0 0,1 ',
        rootRadius * Math.cos(theta),
        ',',
        rootRadius * Math.sin(theta),
        'L',
        radius * Math.cos(theta),
        ',',
        radius * Math.sin(theta)
      );

      theta += slopeAngle;
      path.push(
        'L',
        outsideRadius * Math.cos(theta),
        ',',
        outsideRadius * Math.sin(theta)
      );
      theta += addendumAngle;
      path.push(
        'A',
        outsideRadius,
        ',',
        outsideRadius,
        ' 0 0,1 ',
        outsideRadius * Math.cos(theta),
        ',',
        outsideRadius * Math.sin(theta)
      );
      theta += slopeAngle;

      path.push(
        'L',
        radius * Math.cos(theta),
        ',',
        radius * Math.sin(theta),
        'L',
        rootRadius * Math.cos(theta),
        ',',
        rootRadius * Math.sin(theta)
      );
    }

    path.push(
      'M0,',
      -holeRadius,
      'A',
      holeRadius,
      ',',
      holeRadius,
      ' 0 0,0 0,',
      holeRadius,
      'A',
      holeRadius,
      ',',
      holeRadius,
      ' 0 0,0 0,',
      -holeRadius,
      'Z'
    );

    return path.join('');
  }

  Utility = {
    keys: function (object: any) {
      if (Object.keys) return Object.keys(object);

      var keys = [];
      for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    },

    distanceSquared: function (x1: number, y1: number, x2: number, y2: number) {
      var xs = x2 - x1,
        ys = y2 - y1;
      return xs * xs + ys * ys;
    },

    angle: function (x1: number, y1: number, x2: number, y2: number) {
      var angle = Math.atan2(y2 - y1, x2 - x1);
      return angle > 0 ? angle : 2 * Math.PI + angle;
    },

    sign: function (x: number) {
      return x < 0 ? -1 : 1;
    },

    arrayShuffle: function (array: any) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    arrayClone: function (array: string | any[]) {
      return array.slice(0);
    },
  };
}
