'use strict';

/**
 * aquitex service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::aquitex.aquitex');
