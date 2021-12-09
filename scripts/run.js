const uploadToIPFS = require("../utils/uploadToIPFS.js")
const ipfsClient = require("ipfs-http-client")

const NAMES = [
    "Pablo",
    "Jake",
    "Sarah",
    "Anthony",
    "Pete"
]

const IMAGE_NAMES = [
    "Pablo.jpeg",
    "Jake.png",
    "Sarah.png",
    "Anthony.png",
    "Pete.png"
]

const SPEED_VALUES = [92, 81, 83, 94, 71]
const POWER_VALUES = [87, 84, 71, 69, 93]
const DEFENSE_VALUES = [89, 77, 96, 98, 62]
const PITCHING_VALUES = [83, 96, 62, 72, 50]

const main = async () => {
    const attributes = {

    }
    const ipfs = await ipfsClient.create()
    await createCharacterJson(ipfs, 1)
    //const backyardBaseballContractFactory = await hre.ethers.getContractFactory("BackyardBaseball")
    //const backyardBaseballContract = await backyardBaseballContractFactory.deploy()
    //await backyardBaseballContract.deployed()

    //console.log("Backyard Baseball contract deployed to ", backyardBaseballContract.address)
}

const createCharacterJson = async (ipfs, idx) => {
    const imagePath = `./assets/images/${IMAGE_NAMES[idx]}`
    const imageCID = await uploadToIPFS.uploadFileToIPFS(ipfs, idx, imagePath)
    console.log(imageCID)
    const imageURI = `ipfs://${imageCID}`

    attributes = {
        name: NAMES[idx],
        image: imageURI,
        speed: SPEED_VALUES[idx],
        power: POWER_VALUES[idx],
        defense: DEFENSE_VALUES[idx],
        pitching: PITCHING_VALUES[idx]
    }

    console.log(attributes)
    uploadToIPFS.generateNFTJson(idx, attributes)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()