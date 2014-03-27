

var AppRouter = Backbone.Router.extend({


    routes: {
        ""        : "main",
        "people"  : "list",
        "table"   : "table"
    },

    initialize: function() {
    },

    main: function() {
        if(!this.mainView) {
            this.mainView = new MainView();
        }
        var peopleList = new PeopleCollection();
//        peopleList.fetch({success: function() {
//            $("#content").html(new PeopleListView({model: peopleList}).el);
//        }});
        $("#content").html(this.mainView.el);
    },

    list: function() {
        if(!this.mainView) {
            this.mainView = new MainView();
        }
        var peopleList = new PeopleCollection();
        peopleList.fetch({success: function() {
            $("#content").html(new PeopleListView({model: peopleList}).el);
        }});
    },

    table: function() {

    //TODO all of this logic should go into view/elsewhere
    // the column/skill model/collection is bullshit and should
    // be handled in a much different fashion
    // Here we've got a jerry-rigged column list based off a 
    // largely unused Backgrid.Columns collection
    // Ideally the columns would represent the total list of skills
    // at any given time, added and remove dynamically.
    // This essentially does that, but not quite as well as we'd like
    // for instance the saving of a changed skill isn't built in yet
        var static_columns = [{
                name: 'id',
                label: 'ID',
                cell: Backgrid.IntegerCell.extend({
                    orderSeparator: ''
                })
            }, {
                name: 'title',
                label: 'Title',
                cell: 'string'
            }, {
                name: 'url',
                label: 'URL',
                cell: 'string'
            }];

        var peopleList = new PeopleCollection();
        var skillList = new SkillCollection();

        var skillColumns = Backgrid.Columns.extend({
            url: "/skills"
        });
        var skills = new skillColumns();
        skills.fetch().done(function() {
            var columns = skills.models.map(function(model) {
                console.log(model.get('title'));
                var col = {
                    name: model.id,
                    label: model.get('title'),
                    cell: 'string'
                }
                return col;
            });
            var cols = static_columns.concat(columns);
            var grid = new Backgrid.Grid({
                columns: cols,
                collection: peopleList
            })
            $('#content').html(grid.render().el);
            peopleList.fetch({reset: true}); 
            $('#content').prepend('Add Yourself!<form action="/people" method="post"><input id="add-person-email" name="title" type="email" placeholder="Email"/><input type="submit" id="add-person"/></form>');
            
            // Hack for vertical headers
            var counter = 1000; // Max 1000 cols
            $.each($('th'),function(index,col){
                $(col).html('<div>'+$(col).html()+"</div>");
                // this line fixes not working sortBy columns due to overlapping divs
                $(col).css('z-index',counter--); 
            });
        });
    }
});



jQuery(document).ready(function($) {

    app = new AppRouter();
    Backbone.history.start();

});
