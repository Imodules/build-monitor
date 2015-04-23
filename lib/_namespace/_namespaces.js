/**
 * Created by paul on 12/31/14.
 */

/* global Collections: true, Controllers: true */

// This file exists so that we can do "use strict" in all other files and
// still have some global namespace variables.

// It is called what it's called and placed where it's placed so that it loads
// as early as possible.

Collections = {
	Hooks: new Mongo.Collection('hooks')
};
Controllers = { };
