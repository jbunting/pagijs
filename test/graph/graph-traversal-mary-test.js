var assert = require('assert');
var testStreams = require('../test-stream');
var GraphParser = require('../../src/js/graph/parsers/graphParser');
var maryStream = testStreams.fullList.filter(function(stream) {
    return stream.name === 'mary';
})[0];

describe('Graph traversal for `mary` stream', function() {
    var graph;
    beforeEach(function(done) {
        GraphParser.parse(maryStream.getXmlStream()).then(function(aGraph) {
            graph = aGraph;
            done();
        });
    });
    it('should return the right amount of nodes', function() {
        assert.equal(graph.getNodes().length, 112);
    });
    it('should return the correct amount of nodes for each node type', function() {
        assert.equal(graph.getNodesByType('TOK').length, 101);
        assert.equal(graph.getNodesByType('COREF').length, 6);
        assert.equal(graph.getNodesByType('SB').length, 5);
    });
    it('should return the correct node by id', function() {
        var node = graph.getNodeById('0');
        assert.equal(node.getProp('start'), 96);
        assert.equal(node.getProp('length'), 4);
        assert.equal(node.getProp('pos'), 'JJ');
    });
    describe('span trait', function() {
        it('node should return the correct text', function() {
            var node = graph.getNodeById('0');
            assert.equal(node.getText(), 'sure');
        });
    });
    describe('sequence trait', function() {
        it('node should have a `next` edge', function() {
            var node = graph.getNodeById('0');
            var nextNode = graph.getNodeById('1');
            assert(node.next() === nextNode);
        });
        it('node should have a `previous` edge', function() {
            var node = graph.getNodeById('1');
            var prevNode = graph.getNodeById('0');
            assert(node.previous() === prevNode);
        });
    });
    describe('span container trait', function() {
        it('node should have a `first` edge', function() {
            var node = graph.getNodeById('68');
            var firstEdge = graph.getNodeById('24');
            assert(node.getFirst() === firstEdge);
        });
        it('node should have a `last` edge', function() {
            var node = graph.getNodeById('68');
            var lastEdge = graph.getNodeById('6');
            assert(node.getLast() === lastEdge);
        });
    });
});