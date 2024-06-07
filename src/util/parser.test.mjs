import { unserialisePhpData } from "./parser.mjs";
import { deepStrictEqual, deepEqual, doesNotMatch } from "assert";

describe("unserialisePhpData function", () => {
  describe("tests for complex types using sample data", () => {
    it("should parse serialized bookmark-of data", () => {
      const input = `a:2:{s:4:"type";s:4:"cite";s:10:"properties";a:2:{s:4:"name";a:1:{i:0;s:27:"SVGOMG - SVGO's Missing GUI";}s:3:"url";a:1:{i:0;s:39:"https://jakearchibald.github.io/svgomg/";}}}`;

      const expected = {
        type: "cite",
        properties: {
          name: "SVGOMG - SVGO's Missing GUI",
          url: "https://jakearchibald.github.io/svgomg/",
        },
      };

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    it("should parse serialised like-of data", () => {
      const input = `a:2:{i:0;s:59:"https://twitter.com/MstrKapowski/status/1080070032468643840";i:1;s:40:"https://mrkapowski.com/2019/01/3831.html";}`;

      const expected = [
        "https://twitter.com/MstrKapowski/status/1080070032468643840",
        "https://mrkapowski.com/2019/01/3831.html",
      ];

      deepStrictEqual(unserialisePhpData(input), expected);
    });

    it("should parse serialised h-card data", () => {
      const input = `a:7:{s:4:"type";s:6:"h-card";s:3:"uid";s:31:"tag:twitter.com,2013:evilkipper";s:10:"numeric-id";s:8:"36053740";s:4:"name";s:17:"Dragon Prince Rob";s:8:"nickname";s:10:"evilkipper";s:3:"url";s:30:"https://twitter.com/evilkipper";s:5:"photo";s:69:"https://pbs.twimg.com/profile_images/1024195739688284165/sQFrY0Yd.jpg";}`;

      const expected = {
        type: "h-card",
        uid: "tag:twitter.com,2013:evilkipper",
        "numeric-id": "36053740",
        name: "Dragon Prince Rob",
        nickname: "evilkipper",
        url: "https://twitter.com/evilkipper",
        photo:
          "https://pbs.twimg.com/profile_images/1024195739688284165/sQFrY0Yd.jpg",
      };

      deepEqual(unserialisePhpData(input), expected);
    });

    it("should parse serialised syndication data", () => {
      const input = `a:1:{i:0;s:59:"https://twitter.com/MstrKapowski/status/1080118538315186177";}`;

      const expected = [
        "https://twitter.com/MstrKapowski/status/1080118538315186177",
      ];

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    it("should parse empty syndication data", () => {
      const input = `a:0:{}`;

      const expected = [];

      deepStrictEqual(unserialisePhpData(input), expected);
    });

    it("should parse serialised repost-of data", () => {
      const input = `a:2:{i:0;s:59:"https://twitter.com/MstrKapowski/status/1080592697063284742";i:1;s:92:"https://mrkapowski.com/2019/01/completed-order-of-the-eternal-saint-for-painthammer2019.html";}`;

      const expected = [
        "https://twitter.com/MstrKapowski/status/1080592697063284742",
        "https://mrkapowski.com/2019/01/completed-order-of-the-eternal-saint-for-painthammer2019.html",
      ];

      deepStrictEqual(unserialisePhpData(input), expected);
    });

    it("should parse serialised read-of data", () => {
      const input = `a:2:{s:4:"type";s:4:"cite";s:10:"properties";a:4:{s:7:"summary";a:1:{i:0;s:248:"Including Cloudflare on a list of dangerous pirate sites suggests that whoever put together such a list (EU regulators) or whoever suggested its inclusion ("film, music, book publishers, etc.") haven't the slightest clue what they're talking about.";}s:4:"name";a:1:{i:0;s:88:"EU's First Attempt At Building A List Of Evil Pirate Sites... Lists Non-Infringing Sites";}s:3:"url";a:1:{i:0;s:137:"https://www.techdirt.com/articles/20181226/15343941294/eus-first-attempt-building-list-evil-pirate-sites-lists-non-infringing-sites.shtml";}s:11:"publication";a:1:{i:0;s:9:"Techdirt.";}}} `;

      const expected = {
        type: "cite",
        properties: {
          summary:
            "Including Cloudflare on a list of dangerous pirate sites suggests that whoever put together such a list (EU regulators) or whoever suggested its inclusion (\"film, music, book publishers, etc.\") haven't the slightest clue what they're talking about.",
          name: "EU's First Attempt At Building A List Of Evil Pirate Sites... Lists Non-Infringing Sites",
          url: "https://www.techdirt.com/articles/20181226/15343941294/eus-first-attempt-building-list-evil-pirate-sites-lists-non-infringing-sites.shtml",
          publication: "Techdirt.",
        },
      };

      deepStrictEqual(unserialisePhpData(input), expected);
    });

    it("should parse serialised in-reply-to data", () => {
      const input = `a:2:{s:4:"type";s:4:"cite";s:10:"properties";a:4:{s:7:"summary";a:1:{i:0;s:47:"“@MstrKapowski Great start to the year bud”";}s:4:"name";a:1:{i:0;s:8:"Jakartor";}s:3:"url";a:1:{i:0;s:55:"https://twitter.com/Jdbadger/status/1080712459906891777";}s:11:"publication";a:1:{i:0;s:7:"Twitter";}}}`;

      const expected = {
        type: "cite",
        properties: {
          summary: "“@MstrKapowski Great start to the year bud”",
          name: "Jakartor",
          url: "https://twitter.com/Jdbadger/status/1080712459906891777",
          publication: "Twitter",
        },
      };

      deepStrictEqual(unserialisePhpData(input), expected);
    });

    it("should parse serialised like-of data", () => {
      const input = `a:1:{i:0;a:2:{s:4:"type";a:1:{i:0;s:6:"h-cite";}s:10:"properties";a:8:{s:5:"photo";a:1:{i:0;s:119:"https://v2.jacky.wtf/media/image/entry%2429ec18c7-8d37-400d-b791-051801128a7c/Screenshot_20191113_024035.png?v=original";}s:11:"syndication";a:3:{i:0;s:62:"https://v2.jacky.wtf/post/29ec18c7-8d37-400d-b791-051801128a7c";i:1;s:54:"https://playvicious.social/@jalcine/103130182418321820";i:2;s:28:"https://news.indieweb.org/en";}s:3:"url";a:1:{i:0;s:62:"https://v2.jacky.wtf/post/29ec18c7-8d37-400d-b791-051801128a7c";}s:9:"published";a:1:{i:0;s:25:"2019-11-13T02:41:34-08:00";}s:7:"updated";a:1:{i:0;s:25:"2019-11-13T02:41:34-08:00";}s:6:"author";a:2:{s:4:"type";a:1:{i:0;s:6:"h-card";}s:10:"properties";a:1:{s:3:"url";a:1:{i:0;s:20:"https://v2.jacky.wtf";}}}s:7:"content";a:1:{i:0;a:2:{s:4:"text";s:81:"I really like how this looks now. Can you believe that this is a IndieWeb client?";s:4:"html";s:97:"<p>I <em>really</em> like how this looks now. Can you believe that this is a IndieWeb client?</p>";}}s:9:"post-type";a:1:{i:0;s:5:"photo";}}}}`;

      const expected = [
        {
          type: "h-cite",
          properties: {
            photo:
              "https://v2.jacky.wtf/media/image/entry%2429ec18c7-8d37-400d-b791-051801128a7c/Screenshot_20191113_024035.png?v=original",
            syndication: [
              "https://v2.jacky.wtf/post/29ec18c7-8d37-400d-b791-051801128a7c",
              "https://playvicious.social/@jalcine/103130182418321820",
              "https://news.indieweb.org/en",
            ],
            url: "https://v2.jacky.wtf/post/29ec18c7-8d37-400d-b791-051801128a7c",
            published: "2019-11-13T02:41:34-08:00",
            updated: "2019-11-13T02:41:34-08:00",
            content: {
              text: "I really like how this looks now. Can you believe that this is a IndieWeb client?",
              html: "<p>I <em>really</em> like how this looks now. Can you believe that this is a IndieWeb client?</p>",
            },
            "post-type": "photo",
            author: {
              type: "h-card",
              properties: {
                url: "https://v2.jacky.wtf",
              },
            },
          },
        },
      ];

      deepEqual(unserialisePhpData(input), expected);
    });
  });

  describe("tests for basic types", () => {
    // test that unserialize works with serialised integer data
    it("should parse serialised integer data", () => {
      const input = `i:0;`;

      const expected = 0;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised float data
    it("should parse serialised float data", () => {
      const input = `d:0.123;`;

      const expected = 0.123;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised boolean data
    it("should parse serialised boolean data", () => {
      const input = `b:1;`;

      const expected = true;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised string data
    it("should parse serialised string data", () => {
      const input = `s:5:"hello";`;

      const expected = "hello";

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised array data
    it("should parse serialised array data", () => {
      const input = `a:2:{i:0;s:5:"hello";i:1;s:5:"world";}`;

      const expected = ["hello", "world"];

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised object data
    it("should parse serialised object data", () => {
      const input = `O:8:"stdClass":1:{s:3:"foo";s:3:"bar";}`;

      const expected = { foo: "bar" };

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised null data
    it("should parse serialised null data", () => {
      const input = `N;`;

      const expected = null;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised reference data
    it("should parse serialised reference value data", () => {
      const input = `i:4;r:0;`;

      const expected = 4;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised custom data
    it("should parse serialised custom data", () => {
      const input = `C:5:"hello":2:{s:4:"name";s:5:"hello";s:9:"serialized";s:5:"world";}`;

      const expected = {
        __PHP_Incomplete_Class_Name: "hello",
        serialized: `s:4:"name";s:5:"hello";s:9:"serialized";s:5:"world";`,
      };

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    //test that property names in serialised objects are fixed properly using fixPropertyName
    it("should fix property names in serialised objects", () => {
      const input = `O:8:"stdClass":1:{s:3:"\u0000*\u0000foo";s:3:"bar";}`;

      const expected = { foo: "bar" };

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that fixPropertyName returns a property name as `${className}::${propertyName}`
    it("should fix property names in serialised objects when the class name is not empty", () => {
      const input = `O:8:"stdClass":1:{s:3:"\u0000otherClass\u0000foo";s:3:"bar";}`;

      const expected = { "otherClass::foo": "bar" };

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that parseRef returns the correct reference value
    it("should parse serialised reference data", () => {
      const input = `R:1;`;

      const expected = undefined;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
  });

  describe("tests for error conditions", () => {
    // test that unserialize works with serialised unknown data
    it("should throw an error when it encounters an unknown type", () => {
      const input = `x:0;`;

      const expected = `Unknown type 'x' at position 0`;

      try {
        unserialisePhpData(input);
      } catch (error) {
        deepStrictEqual(error.message, expected);
      }
    });
    // test that unserialize works with serialised empty data
    it("should throw an error when it encounters an empty string", () => {
      const input = ``;

      const expected = `Unknown type '' at position 0`;

      try {
        unserialisePhpData(input);
      } catch (error) {
        deepStrictEqual(error.message, expected);
      }
    });
    // test that unserialise works with arrays using keys that are not integers or strings
    it("should throw an error when it encounters an array with a non-string or non-integer key", () => {
      const input = `a:2:{i:0;s:5:"hello";b:1;s:5:"world";}`;

      const expected = `Unknown key type 'b' at position 21`;

      try {
        unserialisePhpData(input);
      } catch (error) {
        deepStrictEqual(error.message, expected);
      }
    });
    // test fixPropertyName throws the correct error when it encounters an invalid property name
    it("should throw an error when it encounters an invalid property name", () => {
      const input = `O:8:"stdClass":1:{s:3:"\u0000*foo";s:3:"bar";}`;

      const expected = `Expected two <NUL> characters in non-public property name '\u0000*foo' at position 0`;

      try {
        unserialisePhpData(input);
      } catch (error) {
        deepStrictEqual(error.message, expected);
      }
    });

    // test parseObject throws the correct error when it encounters an invalid property name and sets e.state to the current object
    it("should throw an error when it encounters an invalid property name in an object", () => {
      const input = `O:8:"stdClass":1:{s:3:"\u0000foo";s:3:"bar";}`;

      const expected = `Expected two <NUL> characters in non-public property name '\u0000foo' at position 0`;

      try {
        unserialisePhpData(input);
      } catch (error) {
        deepStrictEqual(error.message, expected);
        doesNotMatch(error.state, undefined);
        deepEqual(error.state, { "\u0000foo": "bar" });
      }
    });
  });
  describe("tests for empty data", () => {
    // test that unserialize works with serialised empty array data
    it("should parse serialised empty array data", () => {
      const input = `a:0:{}`;

      const expected = [];

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty object data
    it("should parse serialised empty object data", () => {
      const input = `O:8:"stdClass":0:{}`;

      const expected = {};

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty custom data
    it("should parse serialised empty custom data", () => {
      const input = `C:0:"":0:{}`;

      const expected = {
        __PHP_Incomplete_Class_Name: "",
        serialized: "",
      };

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty reference data
    it("should parse serialised empty reference data", () => {
      const input = `r:0;`;

      const expected = undefined;
      deepEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty null data
    it("should parse serialised empty null data", () => {
      const input = `N;`;

      const expected = null;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty integer data
    it("should parse serialised empty integer data", () => {
      const input = `i:;`;

      const expected = 0;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty float data
    it("should parse serialised empty float data", () => {
      const input = `d:;`;

      const expected = NaN;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty boolean data
    it("should parse serialised empty boolean data", () => {
      const input = `b:;`;

      const expected = false;

      deepStrictEqual(unserialisePhpData(input), expected);
    });
    // test that unserialize works with serialised empty string data
    it("should parse serialised empty string data", () => {
      const input = `s:0:"";`;

      const expected = "";

      deepStrictEqual(unserialisePhpData(input), expected);
    });
  });
});
