const chai = require('chai')
const expect = chai.expect

const yify = require('../index')

describe('yify', () => {
  describe('search', () => {
    describe('valid movie title', () => {
      it('should return 1 movies', (done) => {
        yify.search('big hero 6', (err, movies) => {
          expect(err).to.be.a('null')
          expect(movies.length).to.equal(1)
          expect(movies[0].magnet).to.be.a('string')

          done()
        })
      })
    })

    describe('invalid movie title', () => {
      it('should return 0 movies', (done) => {
        yify.search('small hero 6', (err, movies) => {
          expect(err).to.be.a('null')
          expect(movies.length).to.equal(0)

          done()
        })
      })
    })
  })

  describe('detail', () => {
    describe('valid movie id', () => {
      it('should return 1 movies', (done) => {
        yify.detail('3024', (err, movie) => {
          expect(err).to.be.a('null')
          expect(movie).to.be.a('object')
          expect(movie.magnet).to.be.a('string')

          done()
        })
      })
    })

    describe('invalid movie id', () => {
      it('should return 0 movies', (done) => {
        yify.detail('-404', (err, movie) => {
          expect(err.message).to.equal('Body not found')
          expect(movie).to.not.be.a('object')

          done()
        })
      })
    })
  })
})
