#!/usr/bin/env bash


cd $(pwd)/../etc

# Drop database and current set of data.
../node_modules/.bin/sequelize db:drop

# Creates new database; requires "create" privileges on database role specified in etc/config.json.
../node_modules/.bin/sequelize db:create

# Creates relations in the database based on the src/models.
../node_modules/.bin/sequelize db:migrate

# Seed database with default data.
../node_modules/.bin/sequelize db:seed:all

# /api/lessons rejects POST or DELETE requests to add/remove rows in the relation, so seeding lessons is required.
# To seed without the default data, replace the previous command the following.
# DEFAULTVALUE=0 ../node_modules/.bin/sequelize db:seed --seed ../seeders/20180000000000-default-lessons.js
