const request = require('request')

const API = {
  list: 'https://yts.ag/api/v2/list_movies.json',
  detail: 'https://yts.ag/api/v2/movie_details.json'
}
const QUALITY = '1080p'
const TRACKERS = [
  'udp://open.demonii.com:1337',
  'udp://tracker.istole.it:80',
  'http://tracker.yify-torrents.com/announce',
  'udp://tracker.publicbt.com:80',
  'udp://tracker.openbittorrent.com:80',
  'udp://tracker.coppersurfer.tk:6969',
  'udp://exodus.desync.com:6969',
  'http://exodus.desync.com:6969/announce'
].join('&tr=')

const magnetURI = (hash, title) => {
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=${TRACKERS}`
}

exports.search = (query, callback) => {
  request({url: API.list, method: 'GET', qs: {query_term: query}, json: true}, (err, res, body) => {
    if (err) return callback(err)

    if (res.statusCode !== 200) {
      return callback(new Error(`Bad status code: ${res.statusCode}`))
    }

    if (!body) {
      return callback(new Error('Body not found'))
    }

    if (body.status !== 'ok') {
      return callback(new Error(`${body.status}: ${body.error}`))
    }

    const movies = body.data.movies
    if (!movies) return callback(null, [])

    movies.forEach(function (movie, i) {
      movie.torrents.some((torrent) => {
        if (torrent.quality === QUALITY) {
          movies[i].magnet = magnetURI(torrent.hash, movie.title_long)
          return true
        }
      })
    })

    callback(null, movies)
  })
}

exports.detail = (id, callback) => {
  request({url: API.detail, method: 'GET', qs: {movie_id: id}, json: true}, (err, res, body) => {
    if (err) return callback(err)

    if (res.statusCode !== 200) {
      return callback(new Error(`Bad status code: ${res.statusCode}`))
    }

    if (!body) {
      return callback(new Error('Body not found'))
    }

    if (body.status !== 'ok') {
      return callback(new Error(`${body.status}: ${body.error}`))
    }

    let movie = body.data.movie
    if (!movie) return callback(null, null)

    movie.torrents.some((torrent) => {
      if (torrent.quality === QUALITY) {
        movie.magnet = magnetURI(torrent.hash, movie.title_long)
        return true
      }
    })

    callback(null, movie)
  })
}
