'use strict';

/**
 * aluno service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::aluno.aluno');
