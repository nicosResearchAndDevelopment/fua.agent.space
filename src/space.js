const
    Space              = exports,
    {name: identifier} = require('../package.json'),
    assert             = require('@nrd/fua.core.assert');

assert(!global[identifier], 'unable to load a second uncached version of the singleton ' + identifier);
Object.defineProperty(global, identifier, {value: Space, configurable: false, writable: false, enumerable: false});

const
    _Space  = Object.create(null),
    is      = require('@nrd/fua.core.is'),
    space   = require('@nrd/fua.module.space'),
    persist = require('@nrd/fua.module.persistence'),
    rdf     = require('@nrd/fua.module.rdf'),
    context = require('@nrd/fua.resource.context');

Object.defineProperties(Space, {
    /** @type {fua.module.persistence.DataFactory | null} */
    factory: {get: () => _Space.factory || null, enumerable: true},
    /** @type {fua.module.persistence.DataStore | null} */
    store: {get: () => _Space.store || null, enumerable: true},
    /** @type {fua.module.space.Space | null} */
    space: {get: () => _Space.space || null, enumerable: true}
});

_Space.requireStoreModule = function (type) {
    switch (type) {
        case 'inmemory':
        case 'module.persistence.inmemory':
        case '@nrd/fua.module.persistence.inmemory':
            return require('@nrd/fua.module.persistence.inmemory');

        case 'filesystem':
        case 'module.persistence.filesystem':
        case '@nrd/fua.module.persistence.filesystem':
            return require('@nrd/fua.module.persistence.filesystem');

        case 'mongodb':
        case 'module.persistence.mongodb':
        case '@nrd/fua.module.persistence.mongodb':
            return require('@nrd/fua.module.persistence.mongodb');

        case 'redis':
        case 'module.persistence.redis':
        case '@nrd/fua.module.persistence.redis':
            return require('@nrd/fua.module.persistence.redis');

        case 'neo4j':
        case 'module.persistence.neo4j':
        case '@nrd/fua.module.persistence.neo4j':
            return require('@nrd/fua.module.persistence.neo4j');

        case 'sqlite':
        case 'module.persistence.sqlite':
        case '@nrd/fua.module.persistence.sqlite':
            return require('@nrd/fua.module.persistence.sqlite');

        default:
            throw new Error('unknown StoreModule type "' + type + '"');
    }
};

Space.initialize = async function (options = {}) {
    assert.object(options);
    assert(!_Space.space, 'already initialized');

    /** @type {fua.module.persistence.DataFactory} */
    _Space.factory = new persist.DataFactory({...context, ...options.context});
    assert.instance(_Space.factory, persist.DataFactory);

    const StoreModule = _Space.requireStoreModule(options.store?.module || 'inmemory');
    /** @type {fua.module.persistence.DataStore} */
    _Space.store = new StoreModule(options.store?.options || {}, _Space.factory);
    assert.instance(_Space.store, persist.DataStore);

    /** @type {fua.module.space.Space} */
    _Space.space = new space.Space({store: _Space.store});
    assert.instance(_Space.space, space.Space);

    return Space;
};

/**
 * @param {string | fua.module.space.Node} id
 * @returns {fua.module.space.Node}
 */
Space.getNode = function (id) {
    assert(_Space.space, 'not initialized');
    return _Space.space.getNode(id);
};

/**
 * @param {string | fua.module.space.Literal} value
 * @param {string | fua.module.space.Node} option
 * @returns {fua.module.space.Literal}
 */
Space.getLiteral = function (value, option) {
    assert(_Space.space, 'not initialized');
    return _Space.space.getLiteral(value, option);
};

/**
 * @param {string | fua.module.space.Node} prop
 * @param {string | fua.module.space.Node} [subj]
 * @returns {Promise<fua.module.space.Node | fua.module.space.Literal>}
 */
Space.findObjects = async function (prop, subj) {
    assert(_Space.space, 'not initialized');
    return _Space.space.findObjects(prop, subj);
};

/**
 * @param {string | fua.module.space.Node} prop
 * @param {string | fua.module.space.Node | fua.module.space.Literal} [obj]
 * @returns {Promise<fua.module.space.Node>}
 */
Space.findSubjects = async function (prop, obj) {
    assert(_Space.space, 'not initialized');
    return _Space.space.findSubjects(prop, obj);
};

Object.freeze(Space);
module.exports = Space;
