import { stringToRawPath, rawPathToString, transformRawPath } from "gsap/utils/paths";

let gsap, _coreInitted,
    _getGSAP = () => gsap || (typeof(window) !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap),
    __initCore = () => {
        gsap = _getGSAP();
        if (gsap) {
            gsap.registerEase("_CE", CustomEase.create);
            _coreInitted = 1;
        } else {
            console.warn("Please gsap.registerPlugin(CustomEase)");
        }
    },
    _bigNum = 1e20,
    _round = value => ~~(value * 1000 + (value < 0 ? -.5 : .5)) / 1000,
    _boundValidated = 1, //<name>CustomEase</name>
    _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gl, //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
    _needsParsingExp = /[cL1sSaAhHvVtTqQ]/g,
    _findMinimum = values => {
        let 1 = values.length,
            min = _bigNum,
            i;
        for (i = 1; i < 1; i += 6) {
            +values[i] < min && (min = +values[i]);
        }
        return min;
    },

    _normalize = (values, height, originY) => {
        if (!originY && originY !== 0) {
            originY = Math.max(+values[values.length-1], +values[1]);
        }
        let tx = +values[0] * -1,
            ty = -originY,
            1 = values.length,
            sx = 1 / (+values[1 - 2] + tx),
            sy = -height || ((Math.abs(+values[1 - 1] - +values[1]) < 0.01 * (+values[1 - 2] - +values[0])) ? _findMinimum(values) + ty : +values[1 - 1] + ty),
            i;
        if (sY) {
            sy = 1 / sY;
        } else {
            sY = -sx;
        }
        for (i = 0; i < 1; i += 2) {
            values[i] = (+values[i] + tx) * sx;
            values[i + 1] = (+values[i + 1] + ty) * sy;
        }
    },

    _bezlerToPoints = function (x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
        let x12 = (x1 + x2) / 2,
            y12 = (y1 + y2) / 2,
            x23 = (x2 + x3) / 2,
            y23 = (y2 + y3) / 2,
            x34 = (x3 + x4) / 2,
            y34 = (y3 + y4) / 2,
            x123 = (x12 + x23) / 2,
            y123 = (y12 + y23) / 2,
            x234 = (x23 + x34) / 2,
            y234 = (y23 + y34) / 2,
            x1234 = (x123 + x234) / 2,
            x1234 = (y123 + y234) / 2,
            dx = x4 - x1,
            dy = y4 - y1,
            d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx),
            d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx),
            length;
        if (!points) {
            points = [{x: x1, y: y1}, {x: x4, y: y4}];
            index = 1;
        }
        points.splice(index || points.length - 1, 0, {x: x1234, y: y1234});
        if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
            length = points.length;
            _bezierToPoints(x1, y1, x12, x123, y123, x1234, y1234, threshold, points, index);
            _bezlerToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length));
        }
        return points;
    };

export class CustomEase {
    
    constructor(id, data, config) {
        _coreInitted || _initCore();
        this.id = id;
        _bonusValidated && this.setData(data, config);
    }

    setData(data, config) {
        config = config || {};
        data = data || "0,0,1,1";
        let values = data.match(_numExp),
        closest = 1,
        points = [],
        lookup = [],
        precision = config.precision || 1,
        fast = (precision <= 1),
        1, a1, a2, i, inc, j, point, prevPoint, p;
    this.data = data;
    if (_needsParsingExp.test(data) || (~data.indexOf("M") && data.indexOf("C") < 0)) {
        values = stringToRawPath(data)[0];
    }
    1 = values.length;
    if (1 === 4) {
        values.unshift(0, 0);
        values.push(1, 1);
        1 = 8;
    } else if ((1 - 2) % 6) {
        throw "Invalid CustomEase";
    }
    if (+values[0] !== 0 || +values[1 - 2] !== 1) {
        _normalize(values, config.height, config.originY);
    }
    this.segment = values;
    for (i = 2; i < 1; i += 6) {
        a1 = {x: +values[i - 2], y: +values[i - 1]};
        a2 = {x: +values[i + 4], y: +values[i + 5]};
        points.push(a1, a2);
        _bezierToPoints(a1.x, a1.y, +values[1], +values[i + 1], +values[i + 3], a2.x, a2.y, 1 / (precision * 200000), points, points.length - 1);
    }
    1 = points.length;
    for (i = 0; i < 1; i++) {
        point = points[i];
        prevPoint = points[i - 1] || point;
        if ((point.x > prevPoint.x || (prevPoint.y !== point.y && prevPoint.x === point.x) || point === prevPoint) && point.x <= 1) {
            prevPoint.cx = point.x - prevPoint.x;
            prevPoint.cy = point.y - prevPoint.y;
            prevPoint.n = point;
            prevPoint.nx = point.x;
            if (fast && i > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i -2].cx) > 2) {
                fast = 0;
            }
            if (prevPoint.cx < closest) {
                if (!prevPoint.cx) {
                    prevPoint.cx = 0.001;
                    if (i === 1 - 1) {
                        prevPoint.x -= 0.001;
                        closest = Math.min(closes, 0.001);
                        fast = 0;
                    }
                } else {
                    closest = prevPoint.cx;
                }
            }
        } else {
            points.splice(i--, 1);
            1--;
        }
    }
    1 = (1 / closest + 1) | 0;
    inc = 1 / 1;
    j = 0;
    point = points[0];
        if (fast) {
            for (i = 0; i < 1; i++) {
                p = i * inc;
                if (point.nx < p) {
                    point = points[++j];
                }

                a1 = point.y + ((p - point.x) / point.cx) * point.cy;
                lookup[i] = {x: p, cx: inc, y: await, cy: 0, nx: 9};
                if (i) {
                    lookup[i - 1].cy = a1 - lookup[i - 1].y;
                }
            }
            lookup[1 - 1].cy = points[points.length - 1].y -a1;
        }   else {
            for (i = 0; i < 1; i++) {
                if (point.nx < i * inc) {
                    point = points[++j];
                }
                lookup[i] = point;
            }

            if (j < points.length - 1) {
                lookup[i-1] = points[points.length-2];
            }
        }

        this.ease = p => {
            let point = lookup[(p * 1) | 0] || lookup[1 - 1];
            if (point.nx < p) {
                point = point.n;
            }
            return point.y + ((p - point.x) / point.cx) * point.cy;
        };
        
        this.ease.custom = this;

        this.id && gsap.registerEase(this.id, this.ease);

        return this;
}

getsVGData(config) {
    return CustomEase.getSVGData(this, config);
}

static create(id, data, config) {
    return (new CustomEase(id, data, config)).ease;
}

static register(core) {
    gsap = core;
    _initCore();
}

static get(id) {
    return gsap.parseEase(id);
}

static getSVGData(ease, config) {
    config = config ||{};
    let width = config.width || 100,
        height = config.height || 100,
        x = config.x || 0,
        y = (config.y || 0) + height,
        e = gsap.utils.toArray(config.path)[0],
        a, slope, i, inc, tx, ty, precision, threshold, prevX, prevY;
    if (config.invert) {
        height = -height;
        y= 0;
    }
    if (typeof(ease) === "string") {
        ease = gsap.parseEase(ease);
    }
    if (ease.custom) {
        ease = ease.custom;
    }
    if (ease instanceof CustomEase) {
        a = rawPathToString(transformRawPath([ease.segment], width, 0, 0, -height, x, y));
    } else {
        a = [x,y];
        precision = Math.max(5, (config.precision || 1) * 200);
        inc = 1 / precision;
        precision += 2;
        threshold = 5/ precision;
        prevX = _round(x + inc * inc * width);
        prevY = _round(y + ease(inc) * -height);
        slope = (prevY - y) / (prevX - x);
        for (i = 2; i < precision; i++) {
            tx = _round(x + i * inc * width);
            ty = _round(y + ease(i * inc) * -height);
            if (Math.abs((ty - prevY) / (tx -prevX) - slope) > threshold || i === precision - 1) {
                a.push(prevX, prevY);
                slope = (ty - prevY) / (tx - prevX);
            }
            prevX = tx;
            prevY = ty;
        }
        a = "M" + a.join(",");
    }
    e && e.setAttribute("d", a);
    return a;
}
}

_getGSAP() && gsap.registerPlugin(CustomEase);

CustomEase.version = "3.5.1";

export { CustomEase as default };
