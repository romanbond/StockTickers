$(function () {

    //symbol = "DBK.DE";
    //symbol = "THYF.F";
    //symbol = "MON";
    symbol = "MSFT";
    //symbol = "BARC.L";
    //symbol = "RBS.L";
    //symbol = "MSFT";
    //symbol = "GOOG";


    /*-- Get the difference between two stock values and throw it with two decimals only */

    function calcVariation(prevValue, currValue) {
        var Variation = (prevValue - currValue);

        /*-- smaller than 10?, then add three decimals */

        if ((prevValue < 10) && (currValue < 10)) {

            if (prevValue < currValue) {
                SymbolandVariation = "+" + (Variation.toFixed(3) * -1);
            } else if (prevValue > currValue) {
                SymbolandVariation = "-" + Variation.toFixed(3);
            } else {
                SymbolandVariation = " " + Variation.toFixed(3);
            }
        }

        /*--and if the value is above 10, then add only two decimals */

        else {

            if (prevValue < currValue) {
                SymbolandVariation = "+" + (Variation.toFixed(2) * -1);
            } else if (prevValue > currValue) {
                SymbolandVariation = "-" + Variation.toFixed(2);
            } else {
                SymbolandVariation = " " + ariation.toFixed(2);
            }
        }

        return SymbolandVariation;
    }

    /*-- Get the percentage difference between two stock values and throw the + - or neutral symbol with two decimals only */

    function calcPercentage(prevValue, currValue) {
        Percentage = ((prevValue / currValue) - 1) * 100;

        if (prevValue < currValue) {
            SymbolandPercentage = "+" + (Percentage.toFixed(2) * -1);
        } else if (prevValue > currValue) {
            SymbolandPercentage = "-" + Percentage.toFixed(2);
        } else {
            SymbolandPercentage = "0";

        }

        return SymbolandPercentage;
    }

    /* - */

    function calcPercentageBalance(prevValue, currValue) {
        var PercentageBalance;

        if (prevValue < currValue) {
            PercentageBalance = "negative";
        } else if (prevValue > currValue) {
            PercentageBalance = "positive";
        } else {
            PercentageBalance = "neutral";
        }

        return PercentageBalance;
    }


    /*-- Draw the arrow up or down depending if the value is positive or negative  */

    function calcArrowSrc(prevValue, currValue) {
        var Variation = (prevValue - currValue);
        if (prevValue < currValue) {
            arrowSrc = "<img src='http://l.yimg.com/a/i/us/fi/03rd/up_g.gif' alt='higher value' />";
        } else if (prevValue > currValue) {
            arrowSrc = "<img src='http://l.yimg.com/a/i/us/fi/03rd/down_r.gif' alt='lower value' />";
        } else {
            arrowSrc = "<br />";
        }
        return arrowSrc;
    }



    /*-- Main function to get the share values from Yahoo Finance using YQL */

    function getShare(symbol) {

        /*-- YQL query constructor*/

        var query = "select * from yahoo.finance.quotes where symbol = " + "'" + symbol + "'";

        var yql = "http://query.yahooapis.com/v1/public/yql?q=" + escape(query) +
            "&format=json&diagnostics=false&env=store://datatables.org/alltableswithkeys&callback=?";

        //console.log(yql);

        $.ajax({
            url: yql,
            dataType: 'json',
            success: function (data) {
                //console.log(data);

                /*-- Action Symbol */
                Title = data.query.results.quote.Symbol;

                /*-- PRE VALUE - PrevLastClose - Store Previous Rendered Value so we can compare with the new one */
                function preLastPreviousClose() {
                    prevLastPreviousClose = $(".CompanyStocks .Variation span.difference").html();
                    if (prevLastPreviousClose) {
                        if (PreviousClose() < 10) {
                            return parseFloat(prevLastPreviousClose).toFixed(3);
                        } else {
                            return parseFloat(prevLastPreviousClose).toFixed(2);
                        }
                    }
                    return 0;
                }

                /*-- Previous Action Close */
                function PreviousClose() {
                    if (data.query.results.quote.PreviousClose < 10) {
                        return parseFloat(data.query.results.quote.PreviousClose).toFixed(3);
                    } else {
                        return parseFloat(data.query.results.quote.PreviousClose).toFixed(2);
                    }
                }

                /*-- PRE VALUE - LastTradePrice - Store Previous Rendered Value so we can compare with the new one */
                function preLastTradePriceOnly() {
                    prevLastTradePriceOnly = $(".CompanyStocks .bigCypher").html();
                    if (prevLastTradePriceOnly) {
                        if (prevLastTradePriceOnly < 10) {
                            return parseFloat(prevLastTradePriceOnly).toFixed(3);
                        } else {
                            return parseFloat(prevLastTradePriceOnly).toFixed(2);
                        }
                    }
                    return 0;
                }

                /*-- Last Trade Price Live */
                function LastTradePriceOnly() {
                    if (data.query.results.quote.LastTradePriceOnly < 10) {
                        return parseFloat(data.query.results.quote.LastTradePriceOnly).toFixed(3);
                    } else {
                        return parseFloat(data.query.results.quote.LastTradePriceOnly).toFixed(2);
                    }
                }

                /*-- PRE VALUE - Open - Store Previous Rendered Value so we can compare with the new one */
                function preOpen() {
                    prevLastPreviousClose = parseFloat($(".CompanyStocks .Open .OpenValue").html());
                    if (prevLastPreviousClose) {
                        if (PreviousClose() < 10) {
                            return parseFloat(prevLastPreviousClose).toFixed(3);
                        } else {
                            return parseFloat(prevLastPreviousClose).toFixed(2);
                        }
                    }
                    return 0;
                }


                /*-- Value when market opened */
                function Open() {
                    if (data.query.results.quote.Open < 10) {
                        return parseFloat(data.query.results.quote.Open).toFixed(3);
                    } else {
                        return parseFloat(data.query.results.quote.Open).toFixed(2);
                    }
                }


                /*-- Last Trade value Date and time */
                LastTradeDate = data.query.results.quote.LastTradeDate;
                LastTradeTime = data.query.results.quote.LastTradeTime;


                /* This function is the one that draws a red or green background
                using the last JSON retrieved value compared to the rendered one in the HTML
                using one of the following classes: variationLiveMaxus, variationLiveMinus and variationLiveNeutral
                */

/* main value*/
//console.log("PRE_LastTradePrice " + preLastTradePriceOnly() + " -VZ- " + "LastTradePrice " + LastTradePriceOnly());

/* variation */
//console.log("PRE_LastPrevClose " + preLastPreviousClose() + " -VZ- " + "LastPrevClose " + parseFloat(calcVariation(PreviousClose(), LastTradePriceOnly())));


                function LastTradePriceOnlyVariation(PrevLiveValue, CurrLiveValue) {
                    if (PrevLiveValue != CurrLiveValue) {
                        if (PrevLiveValue !== 0 && isFinite(PrevLiveValue)) {
                            if (PrevLiveValue < CurrLiveValue) {
                                return 'variationLiveMaxus';
                            } else {
                                return 'variationLiveMinus';
                            }

                        } else {
                            return 'variationLiveNeutral';
                        }
                    } else {
                        return 'variationLiveNeutral';
                    }
                }

/* main value */
//console.log(LastTradePriceOnlyVariation(preLastTradePriceOnly(), LastTradePriceOnly()));

/*variation*/
//console.log(LastTradePriceOnlyVariation(preLastPreviousClose(), parseFloat(calcVariation(PreviousClose(), LastTradePriceOnly()))));


                /*-- Now lets Render all the Stuff */


                /* -- 1 -- */
                /*-- Stock Title */

                $(".CompanyStocks .title").html(
                Title + " LATEST STOCKS");


                /* -- 2 -- */
                /*-- Latest Trade Price (big Number) */


                $(".CompanyStocks .bigCypher")
                    .removeAttr('style')
                    .removeClass('variationLiveMaxus')
                    .removeClass('variationLiveMinus')
                    .removeClass('variationLiveNeutral')
                    .addClass(LastTradePriceOnlyVariation(preLastTradePriceOnly(), LastTradePriceOnly()))
                    .html(LastTradePriceOnly()).animate({
                    backgroundColor: 'transparent',
                    color: '#000000'
                }, 4444);



                /* -- 3 -- */
                /*-- Arrow PreviousClose (after the big number) */

                $(".CompanyStocks .CurrentValue .Symbol").hide().html(
                calcArrowSrc(PreviousClose(), LastTradePriceOnly())).fadeIn(666);

                /* -- 4 -- */
                /*-- Variation vs Previous Close Value (under the arow)*/

                /* color for the whole row */

                $(".CompanyStocks .CurrentValue .Variation")
                    .removeClass('positive')
                    .removeClass('negative')
                    .removeClass('neutral')
                    .addClass(calcPercentageBalance(LastTradePriceOnly(), PreviousClose()));

                $(".CompanyStocks .CurrentValue .Variation > span")
                    .removeAttr('style')
                    .removeClass('variationLiveMaxus')
                    .removeClass('variationLiveMinus')
                    .removeClass('variationLiveNeutral')
                    .addClass(LastTradePriceOnlyVariation(preLastPreviousClose(), parseFloat(calcVariation(PreviousClose(), LastTradePriceOnly())))).animate({
                    backgroundColor: 'transparent'
                }, 4444);

                /* variation */

                $(".CompanyStocks .CurrentValue .Variation .difference")
                    .html(calcVariation(PreviousClose(), LastTradePriceOnly()));


                /* percentage */

                $(".CompanyStocks .CurrentValue .Variation .percent")
                    .html(calcPercentage(PreviousClose(), LastTradePriceOnly())).prepend('(').append('%)');

                /* -- 5 -- */
                /*-- Latest Trade price vs PreMarket
                NOTE that premarket is only shown when the market is opened
                so we will render this only if available */

                /*$(".CompanyStocks .preMarket").
                html(
                    "Open " + Open() +
                    " " + calcVariation(Open(), LastTradePriceOnly()) + calcPercentage(Open(), LastTradePriceOnly()))
                    .children()
                    .animate({
                    backgroundColor: 'transparent'
                }, 666);*/

                $(".CompanyStocks .Open")
                    .removeClass('positive')
                    .removeClass('negative')
                    .removeClass('neutral')
                    .addClass(calcPercentageBalance(LastTradePriceOnly(), Open()));

                 $(".CompanyStocks .Open > span")
                    .removeAttr('style')
                    .removeClass('variationLiveMaxus')
                    .removeClass('variationLiveMinus')
                    .removeClass('variationLiveNeutral')
                    .addClass(LastTradePriceOnlyVariation(preOpen(), parseFloat(calcVariation(Open(), LastTradePriceOnly())).toFixed(2))).animate({
                    backgroundColor: 'transparent'
                }, 4444);

                //console.log(preOpen() +" "+ parseFloat(calcVariation(Open(), LastTradePriceOnly())).toFixed(2));

                $(".CompanyStocks .Open .openLabel").html("Open");

                $(".CompanyStocks .Open .OpenValue").html(Open());

                $(".CompanyStocks .Open .difference").html(calcVariation(Open(), LastTradePriceOnly()));

                $(".CompanyStocks .Open .percent").html(calcPercentage(Open(), LastTradePriceOnly())).prepend('(').append('%)');

                /* -- 6 -- */
                /*-- Date Stuff */

                $(".CompanyStocks .dateStock").html(
                LastTradeDate +
                    " - " + LastTradeTime);

            }
        });

    }

    /*-- Autorefreshing function */


    var count = 1;

    function transition() {
        getShare(symbol);
    }

    transition();

    InOut = window.setInterval(transition, 15000);



});
