const express = require('express')
const router = express.Router()
const pool = require('./pool.js')
const upload = require('./multer.js')
const fs = require('fs')

router.get('/movie_interface', function (req, res) {
    res.render('movieinterface', { message: '' })
})

router.post('/submit_movie', upload.any(''), function (req, res) {
    try {
        console.log("Body", req.body)


        pool.query("insert into movie(stateid, cityid, moviename, actorsname, actressname, musicdirector, director, producer, musiccompany, logo, cinema, screen, time, poster) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.stateid, req.body.cityid, req.body.moviename, req.body.actorsname, req.body.actressname, req.body.musicdirector, req.body.director, req.body.producer, req.body.musiccompany, req.files[0].filename, req.body.cinema, req.body.screen, req.body.time, req.files[1].filename], function (error, result) {
            if (error) {
                console.log("Error", error)
                res.render('movieinterface', { message: 'There is issue in the database ..Pls contact with data administrator' })
            }
            else {
                res.render('movieinterface', { message: 'Movie submitted successfully...' })
            }
        })
    }
    catch {
        res.render('movieinterface', { message: 'Server error ...Pls contact with backend team...' })
    }
})


router.get('/statefill', function (req, res) {
    try {
        pool.query("select * from state", function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'Database error..Pls contact with database administrator' })
            }
            else {
                res.json({ data: result, status: true, message: 'Success' })
            }
        })
    }
    catch {
        res.json({ data: [], status: false, message: 'Server error ...Pls contact with backend team...' })
    }
})


router.get('/fillcity', function (req, res) {
    console.log(req.query)
    try {
        pool.query("select * from city where stateid=?", [req.query.stateid], function (error, result) {
            if (error) {
                res.json({ data: [], status: false, message: 'Database error..Pls contact with database administrator' })
            }
            else {
                res.json({ data: result, status: true, message: 'Success' })
            }
        })
    }
    catch (e) {
        res.json({ data: [], status: false, message: 'Server error ...Pls contact with backend team...' })
    }
})


router.get('/display_all_movie', function (req, res) {
    try {
        pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid)as statename,(select C.cityname from city C where C.cityid=M.cityid)as cityname from movie M", function (error, result) {
            if (error) {
                res.render('displayallmovie', { status: false, data: [] })
            }
            else {
                res.render('displayallmovie', { status: true, data: result })
            }
        })
    }
    catch {
        res.render('displayallmovie', { status: false, data: [] })
    }
})


router.get('/update_movie', function (req, res) {
    try {
        pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid)as statename,(select C.cityname from city C where C.cityid=M.cityid)as cityname from movie M where M.movieid=?", [req.query.movieid], function (error, result) {
            if (error) {

                res.render('updatemovie', { status: false, data: [] })
            }
            else {
                console.log("kkkkkkkkkkk", result[0])
                res.render('updatemovie', { status: true, data: result[0] })
            }
        })
    }
    catch {
        res.render('updatemovie', { status: false, data: [] })
    }
})


router.post('/update_all_movie', function (req, res) {
    if (req.body.btn == "Edit") {
        pool.query("update movie set stateid=?, cityid=?, moviename=?, actorsname=?, actressname=?, musicdirector=?, director=?, producer=?, musiccompany=?,  cinema=?, screen=?, time=? where movieid=?", [req.body.stateid, req.body.cityid, req.body.moviename, req.body.actorsname, req.body.actressname, req.body.musicdirector, req.body.director, req.body.producer, req.body.musiccompany, req.body.cinema, req.body.screen, req.body.time, req.body.movieid], function (error, result) {
            if (error) {
                res.redirect('/movie/display_all_movie')
            }
            else {

                res.redirect('/movie/display_all_movie')
            }
        })
    }

    else {
        pool.query("delete from movie where movieid=?", [req.body.movieid], function (error, result) {
            if (error) {
                res.redirect('/movie/display_all_movie')
            }
            else {
                fs.unlinkSync(`E:/movieproject/public/images/${req.body.poster}`, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Deleted")
                    }
                })

                res.redirect('/movie/display_all_movie')
            }
        })
    }
})

router.get('/show_movie', function (req, res, next) {
    res.render('showmovie')
})

router.get('/get_all_movie', function (req, res, next) {
    pool.query("select * from movie", function (error, result) {
        console.log(result)
        res.json({ data: result })
    })
})


router.get('/get_all_movies', function (req, res, next) {
    var q = `select * from movie where moviename like '%${req.query.pattern}%'`
    pool.query(q, function (error, result) {
        res.json({ data: result })
    })
})


router.get('/show_picture', function (req, res) {
    res.render("showpicture", { data: req.query })
})

router.post('/edit_picture', upload.single('poster'), function (req, res) {
    try {
        pool.query("update movie set poster=? where movieid=?", [req.file.filename, req.body.movieid], function (error, result) {
            if (error) {
                res.redirect('/movie/display_all_movie')
            }
            else {
                fs.unlinkSync(`E:/movieproject/public/images/${req.body.oldposter}`, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Deleted")
                    }
                })

                res.redirect('/movie/display_all_movie')
            }
        })
    }
    catch {
        res.redirect('/movie/display_all_movie')
    }
})

module.exports = router