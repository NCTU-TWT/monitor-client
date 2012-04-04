require.config
    paths:
        jquery: 'lib/jquery-1.7.1.min'
        io: 'lib/socket.io.min.amd'
        raphael: 'lib/raphael-min'
        underscore: 'lib/underscore-min.amd'
        backbone: 'lib/backbone-min.amd'
        hogan: 'lib/hogan-1.0.5.min.amd'
        
require ['jquery','io', 'raphael', 'underscore', 'backbone', 'hogan'], ($, io, Raphael, _, Backbone, hogan) ->




    class Record extends Backbone.Model
        defaults:
            name: 'Unknown Sensor'
            stream: {}
            session: null
            lowerBound: -1
            upperBound: 1
            reference: 0
        urlRoot: '/sessions'
            
    class Records extends Backbone.Collection
        model: Record
        url: '/sessions'
        parse: (reply) =>
        
            for session in reply
                for header in session
                    header.id = header.session
                    @add header
    

    class RecordView extends Backbone.View
    
        events:
            'click': 'select'
            'click .record-icon': 'remove'
    
        template: hogan.compile $('#record-template').text()
        
        tagName: 'li'
        
        initialize: ->
            console.log 'new view'
            console.log @model
            
            @$el.html @template.render
                id: @model.get 'session'
            
        select: ->
            $('#record li').removeClass 'active'
            @$el.addClass 'active'
            
        remove: ->
            
            @model.destroy()
            @$el.remove()
                           
            return false
            
            
    class App extends Backbone.View
        
        el: $('body')
                
        initialize: (param) ->
            @records = param.records            
            @records.on 'add', @addRecord
            
                
        addRecord: (model) =>
        
            recordView = new RecordView
                model: model
              
            $('#record ul').append recordView.render().el
            
    
    #
    #   Initialize
    #
    
    records = new Records
    
    app = new App
        records: records
    
    socket = io.connect()
    socket.on 'header', (data) ->
        #console.log data
    socket.on 'data', (data) ->
        #console.log data
    
    $ ->
        records.fetch()
