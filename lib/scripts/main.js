(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    var App, Record, RecordView, Records, app, records, socket;
    Record = (function(_super) {

      __extends(Record, _super);

      function Record() {
        Record.__super__.constructor.apply(this, arguments);
      }

      Record.prototype.defaults = {
        name: 'Unknown Sensor',
        stream: {},
        session: null,
        lowerBound: -1,
        upperBound: 1,
        reference: 0
      };

      Record.prototype.urlRoot = '/sessions';

      return Record;

    })(Backbone.Model);
    Records = (function(_super) {

      __extends(Records, _super);

      function Records() {
        this.parse = __bind(this.parse, this);
        Records.__super__.constructor.apply(this, arguments);
      }

      Records.prototype.model = Record;

      Records.prototype.url = '/sessions';

      Records.prototype.parse = function(reply) {
        var header, session, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = reply.length; _i < _len; _i++) {
          session = reply[_i];
          _results.push((function() {
            var _j, _len2, _results2;
            _results2 = [];
            for (_j = 0, _len2 = session.length; _j < _len2; _j++) {
              header = session[_j];
              header.id = header.session;
              _results2.push(this.add(header));
            }
            return _results2;
          }).call(this));
        }
        return _results;
      };

      return Records;

    })(Backbone.Collection);
    RecordView = (function(_super) {

      __extends(RecordView, _super);

      function RecordView() {
        RecordView.__super__.constructor.apply(this, arguments);
      }

      RecordView.prototype.events = {
        'click': 'select',
        'click .record-icon': 'remove'
      };

      RecordView.prototype.template = hogan.compile($('#record-template').text());

      RecordView.prototype.tagName = 'li';

      RecordView.prototype.initialize = function() {
        console.log('new view');
        console.log(this.model);
        return this.$el.html(this.template.render({
          id: this.model.get('session')
        }));
      };

      RecordView.prototype.select = function() {
        $('#record li').removeClass('active');
        return this.$el.addClass('active');
      };

      RecordView.prototype.remove = function() {
        this.model.destroy();
        this.$el.remove();
        return false;
      };

      return RecordView;

    })(Backbone.View);
    App = (function(_super) {

      __extends(App, _super);

      function App() {
        this.addRecord = __bind(this.addRecord, this);
        App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.el = $('body');

      App.prototype.initialize = function(param) {
        this.records = param.records;
        return this.records.on('add', this.addRecord);
      };

      App.prototype.addRecord = function(model) {
        var recordView;
        recordView = new RecordView({
          model: model
        });
        return $('#record ul').append(recordView.render().el);
      };

      return App;

    })(Backbone.View);
    records = new Records;
    app = new App({
      records: records
    });
    socket = io.connect();
    socket.on('header', function(data) {});
    socket.on('data', function(data) {});
    return $(function() {
      return records.fetch();
    });
  });

}).call(this);
