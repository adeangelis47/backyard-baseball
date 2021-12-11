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
    const ipfs = await ipfsClient.create()
    try {
        await ipfs.files.mkdir("/backyard-baseball")
    } catch {
        await ipfs.files.rm("/backyard-baseball", {recursive: true})
        await ipfs.files.mkdir("/backyard-baseball")
        const stat = await ipfs.files.stat("/backyard-baseball")
        console.log("created new directory")
        console.log(stat)
    }

    await createCharacterJson(ipfs, 0)
    await createCharacterJson(ipfs, 1)
    await createCharacterJson(ipfs, 2)
    await createCharacterJson(ipfs, 3)
    const { cid: dirCID } = await ipfs.files.stat("/backyard-baseball")
    console.log(dirCID)

    const accounts = await hre.ethers.getSigners()
    const account = accounts[0]
    const backyardBaseballContractFactory = await hre.ethers.getContractFactory("BackyardBaseball")
    const backyardBaseballContract = await backyardBaseballContractFactory.deploy()
    await backyardBaseballContract.deployed()

    console.log("Backyard Baseball contract deployed to ", backyardBaseballContract.address)
    await backyardBaseballContract.setBaseURI(`ipfs://${dirCID.toString()}/`)
    const baseURI = await backyardBaseballContract.baseURI()
    console.log(baseURI)
    // mint tokens
    await backyardBaseballContract.mintCharacter(1)
    // have another account buy nft
    const tokenURI = await backyardBaseballContract.tokenURI(0)
    console.log(tokenURI)
}

const createCharacterJson = async (ipfs, idx) => {
    const imagePath = `./assets/images/${IMAGE_NAMES[idx]}`
    const imageCID = await uploadToIPFS.uploadFileToIPFS(ipfs, idx, imagePath)
    const imageURI = `ipfs://${imageCID}`

    const attributes = {
        name: NAMES[idx],
        image: imageURI,
        speed: SPEED_VALUES[idx],
        power: POWER_VALUES[idx],
        defense: DEFENSE_VALUES[idx],
        pitching: PITCHING_VALUES[idx]
    }
    const jsonAttributes = JSON.stringify(attributes)

    await ipfs.files.write(`/backyard-baseball/${idx}`, jsonAttributes, {create: true})
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