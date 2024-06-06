import { unserialisePhpData } from "./parser.mjs";
import { deepStrictEqual, deepEqual } from "assert";

describe("unserialisePhpData function", () => {
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
});
