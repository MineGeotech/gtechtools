module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ],
    "darwin": [
      "zip"
    ],
    "linux": [
      "deb",
      "rpm"
    ]
  },
  "electronPackagerConfig": {},
  "electronWinstallerConfig": {
    "name": "GeotechTools",
    "CompanyName":"MineGeotech",
    "ProductName":"Geotech Tools",
    "packageName":"GeotechTools"
  },
  "electronInstallerDebian": {},
  "electronInstallerRedhat": {},
  "github_repository": {
    "owner": "muzbox",
    "name": "https://github.com/MineGeotech/gtechtools"
  },
  "windowsStoreConfig": {
    "packageName": "gtechtools"
  }
};