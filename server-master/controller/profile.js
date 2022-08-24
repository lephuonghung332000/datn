const Profile = require('../models/Profile');

const updateFriend = async function ({ idFriend, idUser }) {
    console.log(idFriend,idUser)
    try {

        const profile = await Profile.findOneAndUpdate(
            { user: idUser },
            { $push: { listFriends: { $each: [idFriend] } } },
            { new: false }
        )
        await profile.save();
        console.log(profile)
        return profile;
        
    } catch {
        console.log("Loi")
    }
}

const updateProductRequire = async function ({ idProduct, idUser }) {
    try {

        const profile = await Profile.findOneAndUpdate(
            { user: idUser },
            { $push: { listProductRequire: { $each: [idProduct] } } },
            { new: false }
        )
        await profile.save()

        return profile;
    } catch {
        console.log("Loi")
    }
}



module.exports = {
    updateProductRequire,
    updateFriend
}