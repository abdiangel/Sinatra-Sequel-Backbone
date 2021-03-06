**Sinatra + Sequel + Backbone = :heart:**

## Feature

Simple web app for create snippets and comment it with de power of **Backbone & Marionette** and **Sinatra** modular style architecture.

[![Build Status](https://travis-ci.org/CharlyJazz/Sinatra-Sequel-Backbone.svg?branch=master)](https://travis-ci.org/CharlyJazz/Sinatra-Sequel-Backbone)

## Dependencies

1. Ruby
2. Node

## Install

1. Clone the repo.
2. Install the gems with the command `bundle install --with test development`.
3. Install front-end dependencies with the command `npm install` or `yarn install`
4. Run the command `npm run watch` for create bundle app file
5. Create roles with the command `bundle exec rake db:role:create`
6. Create tags with the command `bundle exec rake db:tag:create`
7. Populate database with initial data with the command `bundle exec rake db:populate`
8. Create 2048 bit RSA Key and export the RSA Public Key [Read](#openssl)
9. Run `bundle exec rackup -p 8000`

## Test

You can test the app with the command `bundle exec rspec spec/`.

## OpenSSL

This app will load app.rsa and app.rsa.pub as sign and verify keys for the JWT encode and decode

the app.rsa and app.rsa.pub were generated with:

`openssl genrsa -out app.rsa 2048`

`openssl rsa -in app.rsa -pubout > app.rsa.pub`

## Resources

    - https://github.com/jeremyevans/sequel/blob/master/lib/sequel/plugins/json_serializer.rb
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/JsonSerializer.html
    - http://sequel.jeremyevans.net/rdoc-plugins/classes/Sequel/Plugins/Serialization.html
    - https://github.com/nickdufresne/jwt-sinatra-example/blob/master/app.rb
    - https://rietta.com/blog/2012/01/27/openssl-generating-rsa-key-from-command/
    - http://www.odata.org/documentation/odata-version-3-0/url-conventions/
    - http://ricostacruz.com/cheatsheets/sequel.html
    - https://stackoverflow.com/questions/4115115/extract-a-substring-from-a-string-in-ruby-using-a-regular-expression
    - http://sequel.jeremyevans.net/rdoc-plugins/files/lib/sequel/extensions/pagination_rb.html
    - https://workaround.org/articlesequel-model-pagination-with-padrino/
    - https://stackoverflow.com/questions/1819614/how-do-i-globally-configure-rspec-to-keep-the-color-and-format-specdoc-o