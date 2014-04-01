

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
window.TableView = Backbone.View.extend({

    initialize: function() {


        var static_columns = [{
            name: 'id',
            label: 'ID',
            sortable: true,
            renderable: false,
            direction: 'descending',
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            }),
            headerCell: Backgrid.HeaderCell
        }, {
            name: 'title',
            label: 'Title',
            cell: 'string'
        }, {
            name: 'url',
            label: 'URL',
            cell: 'string'
        }];

        var peopleList = this.model.peopleList;
        var skills = this.model.skills;

        var columns = skills.models.filter( function(model) {
            //TODO remove this logic, all it does is filter relatioships
            // that aren't actually skills in the first place...
            if(model.get('title') == 'People' || model.get('title') == 'Notes') {
                return false;
            }
            return true;
        }).map(function(model) {
            var col = {
                name: 'skill-'+model.id,
                label: model.get('title'),
                cell: 'string'
            }
            return col;
        });
        var cols = static_columns.concat(columns);
        window.grid = new Backgrid.Grid({
            columns: cols,
            collection: peopleList
        })

        $(this.el).html('<div id="add-person-box"><div id="add-person-title">Add Yourself!</div><div id="add-person-success" style="display: none;">Success</div><form id="add-person-form" action="/people" method="post"><input id="add-person-email" name="title" placeholder="Name"/><input type="submit" id="add-person"/></form><div class="skill-instruction">Put x if skill, i if interest</div></div><div class="backgrid-cont"></div>');

        this.render();

    },

    events: {

        "submit" : "addPerson"
    },

    render: function() {
        //$(this.el).html(this.template());
        //var people = this.model.models;
        //var template = _.template($('#table-view-template').html(), {people : people}); 
        //$(this.el).html(template);
        
        this.$(".backgrid-cont").html(window.grid.render().el);

            
        return this;
    },

    addPerson: function(e) {
        //Prevent form from makeing action
        e.preventDefault(); 

        var $form = $("#add-person-form");
        var url = $form.attr("action");
        var name = $("#add-person-email").val();
        if(name == "") {
            return;
        }

        var scope = this;
        $('#add-person-email').val('');    
        $('#add-person-title').hide();    
        $('#add-person-success').text('Sending...').show();    

        var post = $.post( url, { title: name }, function(data) {
            scope.model.peopleList.fetch({success: function() {
                $('#add-person-success').text('Success!'); 
                var wait = 0;
                // Hacky method for showing new user creation
                // stats
                var delay = setInterval(function() {
                    if(wait >= 1) {
                        clearInterval(delay);
                        $('#add-person-success').hide();
                        $('#add-person-title').show();    
                    }
                    wait++; 
                }, 1000);
             
            }});
        });
    }


});



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

        var template = _.template($('#person-view-template').html(), {person : personData}); 

        $(this.el).html(template);
//        $(this.el).html((this.model.toJSON()));
//        $(this.el).html("<p>hello world</p>"); return this;
    }
});

