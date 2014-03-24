

window.MainView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },

    render: function() {
        //$(this.el).html(this.template());
        $(this.el).html("<p>hello world</p>");
        return this;
    }

});

//This is where the logic currently in the main.js script 
//  for the table should actually reside
//  TODO
/*
window.TableView = Backbone.View.extend({

    initialize: function() {

        var columns = [{
                name: "title",
                label: "Title",
                editable: false,
                cell: Backgrid.IntegerCell.extend({
                    orderSeparator: ''
                })
            }, {
                name: "url",
                label: "URL",
                cell: "string"
            }];
        var grid = new Backgrid.Grid({
            columns: columns,
            collection: people
        });

        $('#content'.append(grid.render().el);
        this.render();
    },

    render: function() {
        //$(this.el).html(this.template());
        var people = this.model.models;
        var template = _.template($('#table-view-template').html(), {people : people}); 
        $(this.el).html(template);
        return this;
    }

});

*/


window.PeopleListView = Backbone.View.extend({
    
    initialize: function() {
        this.render();
    },

    render: function() {

        var people = this.model.models;
        var len = people.length;

        $(this.el).html('<ul class="peopleList"></ul>');
        
        for(var i = 0; i < len; i++) {
            $(this.el).append(new PersonView({model: people[i]}).render().el);
        }
//        var len = people.length;

        return this;
    }
});

window.PersonView = Backbone.View.extend({
    
    initialize: function() {
        this.render();
    },

    render: function() {

        //var personData = this.model.attributes._node._data.data;
        var personData = this.model;
        console.log(personData);
        console.log(personData.toJSON());

        var template = _.template($('#person-view-template').html(), {person : personData}); 

        $(this.el).html(template);
//        $(this.el).html((this.model.toJSON()));
//        $(this.el).html("<p>hello world</p>");
        return this;
    }
});

