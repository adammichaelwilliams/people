
window.Person = Backbone.Model.extend({

    urlRoot: "/people",

    idAttribute: "_id",

    initialize: function() {
    }

});
    

window.PeopleCollection = Backbone.Collection.extend({

    model: Person,

    url: "/people"

});

