const connector = require('../model/sequelizeSetUp');
const Sequelize = require('sequelize');

const matches = connector.define('matches', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    season: Sequelize.STRING,
    date: Sequelize.DATE,
    team1: Sequelize.STRING,
    team2: Sequelize.STRING,
    toss_winner: Sequelize.STRING,
    result: Sequelize.STRING,
    winner: Sequelize.STRING,
    win_by_runs: Sequelize.INTEGER,
    win_by_wickets: Sequelize.INTEGER
});

const deliveries = connector.define('deliveries', {
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true
    },
    batting_team: Sequelize.STRING,
    bowling_team: Sequelize.STRING,
    over: Sequelize.INTEGER,
    ball: Sequelize.INTEGER,
    batsman: Sequelize.STRING,
    bowler: Sequelize.STRING,
    batsman_runs: Sequelize.INTEGER,
    extra_runs: Sequelize.INTEGER,
    total_runs: Sequelize.INTEGER
});

//matches.belongsTo(deliveries, { foreignKey: 'id' });
deliveries.removeAttribute("id");
deliveries.belongsTo(matches, { foreignKey: 'match_id' });
matches.hasMany(deliveries, { foreignKey: 'id' });

connector.sync();

// ___________________ 1st question
const findNumberOfMatches = (req, res) => {
    let obj = {};
    matches.findAll({
        group: ['season'],
        attributes: ['season', [Sequelize.fn('count', Sequelize.col('season')), 'matchPlayed']]
    }).then(result => {
        for (let i = 0; i < result.length; i++) {
            if (result[i].dataValues.season !== 0)
                obj[result[i].dataValues.season] = result[i].dataValues.matchPlayed;
            // console.log(result[i].dataValues.season, " matchplayedCount ", result[i].dataValues.seasonCount);
        }
        console.log(obj);
        res.json(obj);
    }).catch((err) => res.send(err))
}


// ______________________2nd question

const matchesWonPerSeason = (req, res) => {
    matches.findAll({
        group: ['winner', 'season'],
        attributes: ['winner', 'season', [Sequelize.fn('count', Sequelize.col('winner')), 'seasonCount']]
    }).then(function (result) {
        let year = {};
        for (let i = 0; i < result.length; i++) {
            if (result[i].dataValues.season !== 0 && result[i].dataValues.winner !== '') {
                if (year.hasOwnProperty(result[i].dataValues.winner)) {
                    year[result[i].dataValues.winner][result[i].dataValues.season] = result[i].dataValues.seasonCount;
                } else {
                    year[result[i].dataValues.winner] = {};
                    year[result[i].dataValues.winner][result[i].dataValues.season] = result[i].dataValues.seasonCount;
                }
            }
        }
        console.log("year   ", year);
        res.json(year)
    }).catch((err) => res.send(err))

}

//_______________________3rd question

const extraRunsConceded = (req, res) => {
    var obj = {};
    deliveries.findAll({
        attributes: ["bowling_team", [connector.fn("SUM", connector.col("extra_runs")), "extraRuns"]],
        group: ["bowling_team"],
        include: [{
            model: matches,
            where: {
                season: 2016
            },
            attributes: ["season"],
        }],
    }).then(result => {
        for (let i = 0; i < result.length; i++) {
            if (obj.hasOwnProperty(result[i].dataValues.bowling_team))
                obj[result[i].dataValues.bowling_team] += parseInt(result[i].dataValues.extraRuns);
            else
                obj[result[i].dataValues.bowling_team] = parseInt(result[i].dataValues.extraRuns);
        }
        console.log(obj);
        res.json(obj);
    }).catch((err) => res.send(err))

}

// ____________________________4th question 

const economicalRate = (req, res) => {
    var obj = {};
deliveries.findAll({
    group: ['bowler'],
    attributes: ['bowler', [Sequelize.literal('(SUM(total_runs)) / (COUNT(ball)/6)'), 'eco'], [Sequelize.literal('(SUM(total_runs))'), 'total_runs'], [Sequelize.literal('(COUNT(ball/6))'), 'ball']],
    include: [{
        model: matches,
        where: { season: 2015 }
    }],
    order: connector.literal('eco ASC'),
    limit: 10
}).then(result => {
    for (let i = 0; i < result.length; i++) {
        obj[result[i].dataValues.bowler] = result[i].dataValues.eco
    }
    // console.log(obj);
    res.json(obj);
}).catch((err) => res.send(err))

}


const mat = findNumberOfMatches;

// console.log(mat);

module.exports = {
    findNumberOfMatches: findNumberOfMatches,
    matchesWonPerSeason: matchesWonPerSeason,
    extraRunsConceded: extraRunsConceded,
    economicalRate: economicalRate
};