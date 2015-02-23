(function () {

    var Beer = function () {};

    //€ per liter
    var price;
    var name;
    var amount;
    var time;
    
    /*
    Oluen valmistaminen: keitto, käyminen, hiilihapotus, pullotus / tynnyriin
    Ainekset: mallakset lajeittain erikseen, muut ainekset pakettina
    Myynti: ketjuille pullossa, ravintoloille tynnyreissä (kuvataanko vain litramäärien eroina + visuaalisesti?) + yksityinen
    
    */

    Beer.prototype = {

        update: function () {
            //  alert(Brew.game.time.elapsed);
        },

        getBeer: function () {
            return this.name;
        },

        sell: function (litres) {
          //  alert(this.amount);
            this.amount = this.amount - litres;        
        },
        
        cook: function (litres) {
            //when time is up
            this.amount = this.amount + litres;
        }
    };

    Brew.Beer = Beer;
})();