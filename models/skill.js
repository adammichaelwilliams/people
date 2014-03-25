
var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase('http://localhost:7474');


var INDEX_NAME = 'nodes';
var INDEX_KEY = 'type'; 
var INDEX_VAL = 'skill';
var relationType = 'none';

var Skill = module.exports = function Skill(_node) {
    this._node = _node;
}


Object.defineProperty(Skill.prototype, 'id', {
    get: function() { return this._node.id; }
});

Object.defineProperty(Skill.prototype, 'exists', {
    get: function() { return this._node.exists; }
});

Object.defineProperty(Skill.prototype, 'title', {
    get: function() { return this._node.data['title']; },
    set: function(title) { this._node.data['title'] = title; }
});

Object.defineProperty(Skill.prototype, 'url', {
    get: function() { return this._node.data['url']; },
    set: function(url) { this._node.data['url'] = url; }
});

Object.defineProperty(Skill.prototype, 'type', {
    get: function() { return this._node.skillType; },
    set: function(type) { this._node.skillType = type; }
});

Skill.prototype._getRelations = function(other, callback) {
    var query = [
        'START skill=node({skillId}), other=node({otherId})',
        'OPTIONAL MATCH (skill) -[rel:GENERIC_REL]-> (other)',
        'RETURN rel'
    ].join('\n')
        .replace('GENERIC_REL', relationType);

    var params = {
        skillId: this.id,
        otherId: other.id
    }

    db.query(query, params, function(err, res) {
        if(err) return callback(err);
        var rel = res[0] && res[0]['rel'];
        callback(null, rel);
    });
};

Skill.prototype.save = function(callback) {
    this._node.save(function(err) {
        callback(err);
    });
};

Skill.prototype.relate = function(other, callback) {
    //Where should this logic live?
    //Relationship hash => this type + that type -> rel_type
    //if node.type && other.type == "person"  => friends
    //if node.type && other.type => friends
    this._node.createRelationshipTo(other._node, relationType, {}, function(err, rel) {
        callback(err);
    });
};

Skill.prototype.getRelations = function(callback) {
    var query = [
        'START skill=node({skillId}), other=node:INDEX_NAME(INDEX_KEY="INDEX_VAL")',
        'OPTIONAL MATCH (skill) -[rel:GENERIC_REL]-> (other)',
        'RETURN other, COUNT(rel)'
    ].join('\n')
        .replace('INDEX_NAME', INDEX_NAME)
        .replace('INDEX_KEY', INDEX_KEY)
        .replace('INDEX_VAL', INDEX_VAL)
        .replace('GENERIC_REL', relationType);

    var params = {
        skillId: this.id,
    };

    var skill = this;
    db.query(query, params, function(err, res) {
        if(err) return callback(err);

        var relatives = [];
        var others = [];

        for(var i=0; i < res.length; i++) {
            var other = new Skill(res[i]['other']); 
            var relates = res[i]['COUNT(rel)'];
            if(skill.id === other.id) {
                continue;
            } else if (relates){
                relatives.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, relatives, others);
    });
};

Skill.get = function(id, callback) {
    db.getNodeById(id, function(err, node) {
        if(err) return callback(err);
        callback(null, new Skill(node));
    });
};

Skill.getAll = function(callback) {
    db.getIndexedNodes(INDEX_NAME, INDEX_KEY, INDEX_VAL, function(err, nodes) {
        if(err) {
            if(err.message.match(/Neo4j NotFoundException/i)) {
                return callback(null, []);
            } else {
                return callback(err);
            }
        }
        var skills = nodes.map(function(node) {
            return new Skill(node);
        });
        callback(null, skills);
    });
}

Skill.create = function(data, callback) {
    console.log("Skill creation data:");
    console.log(data);
    var node = db.createNode(data);
    var skill = new Skill(node);
    node.save(function(err) {
        if(err) return callback(err);
        node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function(err) {
            if(err) return callback(err);
            callback(null, skill);
        });
    });
};





