'use strict';
var http = require("https");

const CIRCLE_CI_API_TOKEN = process.env.CIRCLECI_TOKEN;
//VCS_TYPE value can be github or bitbucket
const VCS_TYPE = "github";
const CIRCLE_CI_USER = 'forestryio';
const CIRCLE_CI_PROJECT_NAME = 'docker';
const TOKEN_MSG = 'ERROR: you need to replace line 5 with your own token see: https://circleci.com/account/api ';

module.exports.hello = (event, context, callback) => {
    if (CIRCLE_CI_API_TOKEN.length > 66) {
        console.error(TOKEN_MSG);
        context.fail(TOKEN_MSG);
        callback(null, {TOKEN_MSG});
    } else {
        var options = {
            "method": "POST",
            "hostname": "circleci.com",
            "port": null,
            "path": "/api/v1.1/project/" + VCS_TYPE + "/" + CIRCLE_CI_USER + "/" + CIRCLE_CI_PROJECT_NAME +
            "?circle-token=" + CIRCLE_CI_API_TOKEN,
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            }
        };

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                const response = body.toString();
                console.log(response);
                callback(null, response);
            });
        });

        req.write(JSON.stringify({BUILD_HUGO: 'true', BUILD_JEKYLL: 'true'}));
        req.end();
    }
};
