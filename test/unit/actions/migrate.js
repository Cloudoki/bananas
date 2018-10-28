const { afterEach, before, describe, it } = exports.lab = require('lab').script()
const { expect } = require('code')
const { stub } = require('sinon')

const migrate = require('../../../lib/actions/migrate')
const pg = require('../../../lib/database/postgres')
const Kong = require('../../../lib/kong').Kong
const utils = require('../../../lib/utils')

const stubs = {}

describe('## actions test suite ##', async () => {

  let db = new pg()

  afterEach(async () => {
    Object.keys(stubs).map(stb => stubs[stb].restore())
  })

  describe('Should successfuly migrate N files', async() => {

    let migrations, kong, err
    before(async () => {
      stubs.getAll = stub(db,'getAll')
      .resolves([
        {dataValues: { file: '12345_file1.js'}},
        {dataValues: { file: '12346_file2.js'}},
      ])

      stubs.insertMigration = stub(db, 'insertMigration')
        .resolves()

      stubs.require = stub(utils, 'require')
        .returns({
          up : async () => {},
          down: async () => {},
        })

      kong = new Kong()
      migrations = [
        '12347_file3.js',
        '12348_file4.js',
        '12349_file5.js',
      ]

      try {
        await migrate(kong,migrations, db)
      } catch (error) {
        err = error
      }
    })

    it('Err should be undefined', ()=> {
      expect(err).to.be.undefined()
    })

    it('Should call GetAll migrations', ()=>{
      expect(stubs.getAll.calledWith()).to.be.true()
    })

    it('Should call insertMigration', ()=>{
      expect(stubs.insertMigration.callCount).to.equal(3)
    })

    it('Should call utils.require with 12347_file3.js', ()=>{
      expect(stubs.require.callCount).to.equal(3)
    })

  })

  describe('Should successfuly migrate 1 file', async() => {

    let migrations, kong, err
    before(async () => {
      stubs.getAll = stub(db,'getAll')
      .resolves([
        {dataValues: { file: '12345_file1.js'}},
        {dataValues: { file: '12346_file2.js'}},
      ])

      stubs.insertMigration = stub(db, 'insertMigration')
        .resolves()

      stubs.require = stub(utils, 'require')
        .returns({
          up : async () => {},
          down: async () => {},
        })

      kong = new Kong()
      migrations = [
        '12347_file3.js'
      ]

      try {
        await migrate(kong,migrations, db)
      } catch (error) {
        err = error
      }
    })

    it('Err should be undefined', ()=> {
      expect(err).to.be.undefined()
    })

    it('Should call GetAll migrations', ()=>{
      expect(stubs.getAll.calledWith()).to.be.true()
    })

    it('Should call insertMigration once', ()=>{
      expect(stubs.insertMigration.callCount).to.equal(1)
    })

    it('Should call utils.require once', ()=>{
      expect(stubs.require.callCount).to.equal(1)
    })

  })

  describe('Should successfuly migrate 0 files', async() => {

    let migrations, kong, err
    before(async () => {
      stubs.getAll = stub(db,'getAll')
        .resolves([
          {dataValues: { file: '12345_file1.js'}},
          {dataValues: { file: '12346_file2.js'}},
        ])
      
      stubs.insertMigration = stub(db, 'insertMigration')
        .resolves()

      stubs.require = stub(utils, 'require')
        .returns({
          up : async () => {},
          down: async () => {},
        })

      kong = new Kong()
      migrations = [
        '12345_file1.js',
        '12346_file2.js'
      ]

      try {
        await migrate(kong,migrations, db)
      } catch (error) {
        err = error
      }
    })

    it('Err should be undefined', ()=> {
      expect(err).to.be.undefined()
    })


    it('Should call GetAll migrations', ()=>{
      expect(stubs.getAll.calledWith()).to.be.true()
    })

    it('Should NOT call insertMigrations', ()=>{
      expect(stubs.insertMigration.notCalled).to.be.true()
    })

    it('Should NOT call utils.require', ()=>{
      expect(stubs.require.notCalled).to.be.true()
    })

  })

  describe('Should throw error and stop migration', async() => {

    let migrations, kong, err
    before(async () => {
      stubs.getAll = stub(db,'getAll')
        .rejects()
      
      stubs.insertMigration = stub(db, 'insertMigration')
        .resolves()

      stubs.require = stub(utils, 'require')
        .returns({
          up : async () => { },
          down: async () => { },
        })

      kong = new Kong()
      migrations = [
        '12345_file1.js'
      ]

      try {
        await migrate(kong,migrations, db)
      } catch (error) {
        err = error
      }
    })

    it('Err should not be undefined', ()=> {
      expect(err).to.not.be.undefined()
    })

    it('Should call GetAll migrations', ()=>{
      expect(stubs.getAll.calledOnce).to.be.true()
    })

    it('Should NOT call insertMigrations', ()=>{
      expect(stubs.insertMigration.notCalled).to.be.true()
    })

    it('Should call utils.require', ()=>{
      expect(stubs.require.notCalled).to.be.true()
    })

  })

})
