describe("PresentationFetcher", function() {

    var PresentationFetcher = require("../../lib/pivotal/presentationFetcher");

    var fetcher;

    beforeEach(function() {
      fetcher = new PresentationFetcher();
    });

    describe("When the server side json file does not exist", function() {

      it("", function() {

      });

    });

    describe("When the title is null", function() {

        it("returns 'Pivotal'", function() {
          var result = fetcher.getTitle(null);
          expect(result).toEqual("Pivotal");
        });

    });

    describe("When the title is empty", function() {

        it("returns 'Pivotal'", function() {
          var result = fetcher.getTitle(" ");
          expect(result).toEqual("Pivotal");
        });
        //
    });

});
