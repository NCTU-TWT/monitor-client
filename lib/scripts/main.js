(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  require.config({
    paths: {
      jquery: 'lib/jquery-1.7.1.min',
      io: 'lib/socket.io.min.amd',
      raphael: 'lib/raphael-min',
      underscore: 'lib/underscore-min.amd',
      backbone: 'lib/backbone-min.amd',
      hogan: 'lib/hogan-1.0.5.min.amd'
    }
  });
  require(['jquery', 'io', 'raphael', 'underscore', 'backbone', 'hogan'], function($, io, Raphael, _, Backbone, hogan) {
    var Chart, Mediator, Meter, Oscilloscope, chart, socket;
    Mediator = {};
    _.extend(Mediator, Backbone.Events);
    Chart = {};
    Chart.Model = (function() {
      __extends(Model, Backbone.Model);
      function Model() {
        Model.__super__.constructor.apply(this, arguments);
      }
      Model.prototype.maxAge = 4000;
      Model.prototype.data = [];
      Model.prototype.add = function(data) {
        data.age = (new Date).getTime();
        return this.data.push(data);
      };
      Model.prototype.update = function() {
        var now;
        now = (new Date).getTime();
        return this.data = _.filter(this.data, __bind(function(elem) {
          return now - elem.age < this.maxAge;
        }, this));
      };
      Model.prototype.toPath = function(chart) {
        var coord, dot, now, path, toCoord, _i, _len, _ref;
        if (this.data.length === 0) {
          return;
        }
        now = (new Date).getTime();
        toCoord = function(data) {
          return {
            x: chart.width + 50 - (now - data.age) / 4,
            y: chart.height - (data.value - data.lowerBound) * chart.height / (data.upperBound - data.lowerBound)
          };
        };
        coord = toCoord(this.data[0]);
        path = "M" + coord.x + " " + coord.y + " R";
        _ref = this.data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dot = _ref[_i];
          coord = toCoord(dot);
          path += " " + coord.x + " " + coord.y;
        }
        return path;
      };
      return Model;
    })();
    Chart.Collection = (function() {
      __extends(Collection, Backbone.Collection);
      function Collection() {
        this.render = __bind(this.render, this);
        this.update = __bind(this.update, this);
        this.parse = __bind(this.parse, this);
        Collection.__super__.constructor.apply(this, arguments);
      }
      Collection.prototype.model = Chart.Collection;
      Collection.prototype.parse = function(data) {
        var chart, newChart, raw;
        raw = data;
        try {
          data = JSON.parse(data);
        } catch (error) {
          console.log(error);
          console.log(raw);
          return;
        }
        chart = this.get(data.name);
        if (!chart) {
          newChart = new Chart.Model;
          newChart.add(data);
          newChart.id = data.name;
          newChart.waveform = data.waveform;
          this.add(newChart);
          return Mediator.trigger('chart:new', data.name);
        } else {
          return chart.add(data);
        }
      };
      Collection.prototype.update = function() {
        var model, _i, _len, _ref, _results;
        _ref = this.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(model.update());
        }
        return _results;
      };
      Collection.prototype.render = function() {
        var model, _i, _len, _ref, _results;
        _ref = this.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(model.view.render());
        }
        return _results;
      };
      return Collection;
    })();
    Oscilloscope = (function() {
      __extends(Oscilloscope, Backbone.View);
      function Oscilloscope() {
        this.render = __bind(this.render, this);
        Oscilloscope.__super__.constructor.apply(this, arguments);
      }
      Oscilloscope.prototype.el = $('#oscilloscope-container');
      Oscilloscope.prototype.width = 800;
      Oscilloscope.prototype.height = 150;
      Oscilloscope.prototype.render = function() {
        var path;
        path = this.model.toPath(this);
        return this.path.attr({
          path: path
        });
      };
      Oscilloscope.prototype.initialize = function(id, model) {
        var template;
        this.id = id;
        this.model = model;
        template = hogan.compile($('#oscilloscope').text());
        $('#container').append(template.render({
          name: this.id
        }));
        this.paper = Raphael(this.id, this.width, this.height);
        this.path = this.paper.path('M 0 0');
        return this.path.attr({
          stroke: 'rgb(200, 200, 2005)',
          'stroke-width': 5
        });
      };
      return Oscilloscope;
    })();
    Meter = (function() {
      __extends(Meter, Backbone.View);
      function Meter() {
        Meter.__super__.constructor.apply(this, arguments);
      }
      Meter.prototype.el = $('#meter-container');
      Meter.prototype.width = 800;
      Meter.prototype.height = 150;
      Meter.prototype.initialize = function() {
        return console.log("meter " + this.attributes.id + " initialized");
      };
      Meter.prototype.render = function() {};
      return Meter;
    })();
    chart = new Chart.Collection;
    socket = io.connect();
    socket.on('data', function(data) {
      return Mediator.trigger('chart:data', data);
    });
    setInterval(function() {
      return Mediator.trigger('chart:update');
    }, 40);
    Mediator.bind('chart:data', function(data) {
      return chart.parse(data);
    });
    Mediator.bind('chart:new', function(id) {
      var model;
      console.log('new chart!!');
      model = chart.get(id);
      if (model.waveform) {
        console.log('Oscilloscope');
        return model.view = new Oscilloscope(id, model);
      } else {
        console.log('Meter');
        return model.view = new Meter(id, model);
      }
    });
    return Mediator.bind('chart:update', function() {
      chart.update();
      return chart.render();
    });
  });
}).call(this);
