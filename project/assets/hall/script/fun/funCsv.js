let papaparse = require('papaparse.min');

let csv = {

    turnCsvToJson : function(csvname, callback){
        let toJson = function(csvData){
            let csvJson = {};
            for(let i=1; i<csvData.length; ++i){
                let rowJson = {};
                for(let j=0; j<csvData[0].length; ++j){
                    rowJson[csvData[0][j].trim()] = csvData[i][j];
                    csvJson[i] = rowJson;
                }
            }
            return csvJson;
        }
        cc.loader.loadRes(csvname, function(err, csvData){
            if (err) {
                cc.error(err.message || err);
                return;
            } else {
                let jsData = papaparse.parse(csvData, {
                    complete: function(parsedCsv){
                        callback(toJson(parsedCsv.data));
                    }
                });
            }
        });
    },

    getHuoDong : function(type, callback){
        this.turnCsvToJson('csv/huodong.csv', function(csvJson){
            for(let i=0; i<fun.utils.getLength(csvJson); ++i){
                if(csvJson[i+1].STR_HuoDong === type){
                    callback(csvJson[i+1]);
                }
            }
        });
    },

    getItem : function(itemId, callback){
        this.turnCsvToJson('csv/item.csv', function(csvJson){
            for(let i=0; i<fun.utils.getLength(csvJson); ++i){
                if(parseInt(csvJson[i+1].INT_ItemID) === itemId){
                    callback(csvJson[i+1]);
                }
            }
        });
    },

};

module.exports = csv;