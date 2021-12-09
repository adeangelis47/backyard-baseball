const axios = require("axios")
const fs = require("fs")
const FormData = require("form-data")

const uploadFileToIPFS = async (ipfs, idx, filePath) => {
    const content = fs.createReadStream(filePath)
    const { cid: nftCID } = await ipfs.add({path: idx, filePath})

    return nftCID
}

const generateNFTJson = (idx, attributes) => {
    // write json data to ./assets/nftJson
    const data = JSON.stringify(attributes)
    fs.writeFileSync(`./assets/nftJson/${idx}.json`, data)
}

const uploadFileToPinata = (idx, file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    
    let data = new FormData()
    data.append("file", fs.createReadStream(file))

    const metadata = {
        name: `Backyard Baseball ${idx}`,
        keyvalues: {
            index: idx
        }
    }
    data.append("pinataMetadata", metadata)

    axios
        .post(url, data, {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data.boundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY
            }
        })
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log(error)
        })
}

const uploadJsonToPinata = (idx, attributes) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    axios
        .post(url, attributes, {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY
            }
        })
        .then((response) => {

        })
        .catch((error) => {

        })
}

exports.uploadFileToIPFS = uploadFileToIPFS
exports.generateNFTJson = generateNFTJson
