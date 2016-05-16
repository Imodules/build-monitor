/**
 * Created by paul on 12/31/14.
 */

/* global Collections: true, Controllers: true, ViewModels: true, Models: true */

// This file exists so that we can do "use strict" in all other files and
// still have some global namespace variables.

// It is called what it's called and placed where it's placed so that it loads
// as early as possible.

Collections = {
	Servers: new Mongo.Collection('servers'),
	Projects: new Mongo.Collection('projects'),
	Builds: new Mongo.Collection('builds'),
	MyBuildDisplay: new Mongo.Collection('myBuildDisplay')
};

Controllers = { };
ViewModels = { };
Models = { };
