# Scribe-Server

[![Build Status](https://travis-ci.org/Wizards2016/ScribaServer.svg?branch=master)](https://travis-ci.org/Wizards2016/Scribe-Server)

# ScribaServer

> Server for Scriba mobile app.  Users post messages with GPS coordinates, up or down vote messages, delete their messages, and delete their account.


## Team

  - __Product Owner__: Dan Burke
  - __Scrum Master__: Dennis Nguyen
  - __Engineers__: Stephen Om, Cai Lu

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Contributing](#contributing)

## Usage

> Intended to be used as the server for Scriba mobile app https://github.com/Wizards2016/Scriba

## Requirements

- Node 6.9.1
- NPM
- MySQL 2.12.0
- Express 4.14.0
- Sequelize 3.28.0

## Development

### Installing Dependencies

From within the root directory:

```sh
$ npm install
$ mysql.server start
 >> $ mysql -u root -p    #(hit enter when prompted for password)
 >> $ create database Scribedb
$ grunt
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

