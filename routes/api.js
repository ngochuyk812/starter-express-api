const express = require("express");
const router = express.Router();
const ZingMp3 = require("../model/zingmp3");
const AudioLocal = require("../model/audioLocal")
const fs = require('fs');



router.get("/search", async (req, res) => {
  let name = req.query.name;
  let subjects = [];
  ZingMp3.search(name).then((rs) => {
    if (rs.data.songs) {
      let result = rs.data.songs || [];
      result.forEach(async (element, index) => {
        await ZingMp3.getSong(element.encodeId).then((rsLink) => {
          try {
            subjects.push({
              linkStream: rsLink.data["128"],
              id: element.encodeId,
              title: element.title,
              artistsNames: element.artistsNames,
              thumbnailM: element.thumbnailM,
            });
          } catch {
            subjects.push({
              linkStream: null,
              id: element.encodeId,
              title: element.title,
              artistsNames: element.artistsNames,
              thumbnailM: element.thumbnailM,
            });
          }
          if (subjects.length === result.length) {
            subjects = subjects.filter((tmp) => tmp.linkStream)
            AudioLocal.getAudio((rs)=>{
              const serverUrl = `http://${req.headers.host}`;
              rs.forEach((element,index)=>{
                rs[index] = {...element, linkStream: serverUrl + "/api/stream?link=" + element.path.replace("\\","/")}
              })
              res.send([...rs, ...subjects])
          })
          }
        });
      });
    } else {
      res.send([]);
    }
  });
});
router.get('/stream', function(req, res) {
  let link = req.query.link ||"uploads\\test.mp3"
  const data = fs.readFileSync(link);
  res.setHeader('Content-Type', 'audio/mpeg');
  res.end(data);
});
router.get('/segment/:segment', function(req, res) {
	const segmentPath = 'segment-' + req.params.segment + '.ts';
	fs.createReadStream(segmentPath).pipe(res);
});
router.get("/get_all_info_song", async (req, res) => {
  let id = req.query.id;
  ZingMp3.getInfoSong(id).then(async (rs) => {
    await ZingMp3.getSong(id).then((rsLink) => {
      const element = rs.data;
      console.log({
        linkStream: rsLink.data["128"],
        id: element.encodeId,
        title: element.title,
        artistsNames: element.artistsNames,
        thumbnailM: element.thumbnailM,
      });
      res.send({
        linkStream: rsLink.data["128"],
        id: element.encodeId,
        title: element.title,
        artistsNames: element.artistsNames,
        thumbnailM: element.thumbnailM,
      });
    });
  });
});
const getLinkStream = (rs, callback) => {
  let subjects = [];

  let result = rs || [];
  result.forEach(async (element, index) => {
    await ZingMp3.getSong(element.encodeId).then((rsLink) => {
      try {
        subjects.push({
          linkStream: rsLink.data["128"],
          id: element.encodeId,
          title: element.title,
          artistsNames: element.artistsNames,
          thumbnailM: element.thumbnailM,
        });
      } catch {
        subjects.push({
          linkStream: null,
          id: element.encodeId,
          title: element.title,
          artistsNames: element.artistsNames,
          thumbnailM: element.thumbnailM,
        });
      }
      if (subjects.length === result.length) {
        callback(subjects.filter((tmp) => tmp.linkStream));
      }
    });
  });
};
router.get("/get_song", (req, res) => {
  let id = req.query.id;
  ZingMp3.getSong(id).then((rs) => {
    res.send(rs);
  });
});

router.get("/get_info_song", (req, res) => {
  let id = req.query.id;
  ZingMp3.getInfoSong(id).then((rs) => res.send(rs));
});

router.get("/get_list_artist_song", (req, res) => {
  let id = req.query.id;
  ZingMp3.getListArtistSong(id).then((rs) => res.send(rs));
});
router.get("/", (req, res) => {
  let id = req.query.id;
  ZingMp3.getHome().then((rs) => res.send(rs));
});

router.get("/get_playlist_home", (req, res) => {
  ZingMp3.getHome().then((rs) => {
    let data = rs["data"]["items"];
    data = data.filter(
      (tmp) =>
        tmp["sectionType"] === "banner" ||
        tmp["sectionType"] === "new-release" ||
        tmp["sectionType"] === "playlist"
    );
    data.forEach((tmp, index) => {
      if (tmp["sectionType"] === "banner") {
        tmp["items"].forEach((banner, i) => {
          tmp["items"][i] = {
            ...banner,
            thumbnail: banner["banner"],
            sortDescription: "",
          };
        });
      }
      if (tmp["sectionType"] === "new-release") {
        tmp["items"] = tmp["items"]["all"];
        getLinkStream(tmp["items"], (rsCallback) => {
          tmp["items"] = rsCallback;
          res.send(data);
        });
      }
    });
  });
});

router.get("/get_detail_playlist", (req, res) => {
  let id = req.query.id;
  ZingMp3.getDetailPlaylist(id).then((rs) => res.send(rs));
});
router.get("/get_songs_by_id_playlist", (req, res) => {
  let id = req.query.id;
  ZingMp3.getDetailPlaylist(id).then((rs) => {
    getLinkStream(rs["data"]["song"]["items"], (rsCallback) => {
      res.send(rsCallback);
    });
  });
});
router.get("/get_lyric", (req, res) => {
  let id = req.query.id;
  ZingMp3.getLyric(id).then((rs) => res.send(rs));
});

router.get("/get_lyric", (req, res) => {
  let id = req.query.id;
  ZingMp3.getLyric(id).then((rs) => res.send(rs));
});
router.get('/get_detail_playlist', (req,res) => {
    let id = req.query.id
    ZingMp3.getDetailPlaylist(id).then(rs => res.send(rs))
	
})
router.get('/get_songs_by_id_playlist', (req,res) => {
    let id = req.query.id
    ZingMp3.getDetailPlaylist(id).then(rs => {
        getLinkStream(rs['data']['song']['items'],(rsCallback)=>{
            res.send()})})})
router.get("/top", (req, res) => {
  let id = req.query.id;
  ZingMp3.getTop100().then((rs) => res.send(rs));
});
router.get("/test", (req, res) => {
  const data = fs.readFileSync('uploads\\9b699cf382f14a8e9bbd5c202263c641');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.end(data);
});
module.exports = router;
