
import resemble from "resemblejs";
import fetch from "node-fetch";
import * as fs from "fs-extra";
import path from "path";


const checkValue = 50;

const getDirectories = (targetRoot) =>
    fs.readdirSync(targetRoot, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)


const checkImg509 = (fileInPath) => {
    return new Promise((resolve, reject) => {

        resemble(path.join(__dirname, "../src/utils/509.jpg"))
            .compareTo(fs.readFileSync(fileInPath))
            .onComplete((data) => {
                if (data.misMatchPercentage < checkValue) {
                    console.log(fileInPath, data.misMatchPercentage)
                }
                resolve(data);
            })
    });
}
const checkFolder509 = async (targetRoot, folderList, folderIndex) => {
    const targetFolder = path.join(targetRoot, folderList[folderIndex]);
    const files = fs.readdirSync(targetFolder, { withFileTypes: true });
    const checkList = files.map(el => el.name).filter(el =>
        el.includes("png") || el.includes("jpg")
    );
    const requests = checkList.map(async elName => {
        const fileInPath = path.join(targetFolder, elName)
        return checkImg509(fileInPath)
    })


    const results = await Promise.allSettled(requests);
    const response = results.filter((res) => res.status === 'fulfilled') as PromiseFulfilledResult<any>[];

    const any509 = response.map(el => el.value).filter(el => {
        return el.misMatchPercentage < checkValue;
    }
    ).length !== 0
    return any509;
}


const checkRootFolder509 = async (target, recycleFolderRoot) => {
    const { targetRoot, folderList } = target;
    for (var i = 0; i != folderList.length; i++) {
        const is509 = await checkFolder509(targetRoot, folderList, i);
        console.log("now check:  " + path.join(targetRoot, folderList[i]))
        if (is509) {
            console.error("509found:  " + folderList[i])
            const pathOf509 = path.join(targetRoot, folderList[i])
            const recycleFolder = path.join(recycleFolderRoot, folderList[i])
            fs.moveSync(pathOf509, recycleFolder)
        }

    }

}
const check509 = async () => {
    const targetRoots = ["D:/bufferdriver/"]
    const recycleFolderRoot = "D:/509folder/"
    const targetList = targetRoots.map(el => ({ targetRoot: el, folderList: getDirectories(el) }));
    const requestList = targetList.map(el => checkRootFolder509(el, recycleFolderRoot));
    await Promise.allSettled(requestList);
}


check509()
// console.log(getDirectories())