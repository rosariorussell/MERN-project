const mongoose = require('mongoose');
const axios = require('axios');
const cheerio =  require('cheerio');

const Jobs = mongoose.model('jobs');

const scraper = require('../controllers/jobBoard');

module.exports = app => {
  
    app.get('/api/jobs/list', async (req, res) => {
        //sorted last scraped shown first
        const results = await Jobs.find().sort({'dateAdded': -1});
        res.json(results);
    });

    app.get('/api/jobs/match/:tag', async (req,res)=>{
        const results = await Jobs.find({ 
            $or :[
                //if the jobTitle *or* description contains tag
                //sorted last scraped shown first
                {'jobTitle': { $regex: new RegExp(req.params.tag, 'gi')}},
                {'description': { $regex: new RegExp(req.params.tag, 'gi')}}
             ]}).sort({'dateAdded': -1});

             console.log(results);
        res.json(results);
    });

    //scrapes last 24 hrs. ran 6/29 7.16pm
    app.get('/api/jobs/scrape', async (req, res) => {
        await scraper.scrape();
        res.redirect('/api/jobs/list');
    });


}
