const Admin = require("../models/AdminModel");
const VehicleType = require("../models/VehicleTypeModel");
const functions = require("../functions/deleteImage");

// Load VehicleType page
module.exports.loadVehicleType = async (req, res) => {
    try {
        res.render("addVehicleType");
    } catch (error) {
        console.error(error);
    }
};

// Add VehicleType
module.exports.addVehicleType= async (req, res) => {
    try {
        let loginData = await Admin.find({});
        for (let i in loginData) {
            if (String(loginData[i]._id) === req.session.user_id) {
                if (loginData[i].is_admin == 1) {
                    const VehicleTypes = new VehicleType({ 
                        vehicle_type: req.body.vehicle_type, 
                        image: req.file.filename,
                        is_active: req.body.is_active == "on" ? 1 : 0 
                    });
                    await VehicleTypes.save();
                    res.redirect("/view-vehicle-type");
                    return;
                } else {
                    req.flash('error', 'You have no access to add Vehicle type, You are not super admin !! *');
                    return res.redirect('back');
                }
            }
        }

    } catch (error) {
        console.error(error);
    }
};

// View VehicleType
module.exports.viewVehicleType = async (req, res) => {
    try {
        let loginData = await Admin.find({});
        const VehicleTypes = await VehicleType.find({}).sort({ updatedAt: -1 });
        if(VehicleTypes){
            res.render("viewVehicleType", { VehicleTypes, loginData });
        }
        else {
            console.log(error.message);
        }   
    } catch (error) {
        console.error(error);
    }
};

// Edit VehicleType
module.exports.editVehicleType = async(req,res) => {
    try {
        let loginData = await Admin.find({});
        for (let i in loginData) {
            if (String(loginData[i]._id) === req.session.user_id) {
                if (loginData[i].is_admin == 1) {
                    const vehicles = await VehicleType.findById({_id: req.query.id});
                    res.render("editVehicleType", { vehicles , loginData });
                    return;
                } else {
                    req.flash('error', 'You have no access to edit Vehicle type, You are not super admin !! *');
                    return res.redirect('back');
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// Update VehicleType
module.exports.updateVehicleType = async(req,res) => {
    try {
        let loginData = await Admin.find({});
        for (let i in loginData) {
            if (String(loginData[i]._id) === req.session.user_id) {
                if (loginData[i].is_admin == 1) {
                    const VehicleTypes = await VehicleType.findById({_id: req.body.id});
                    VehicleTypes.vehicle_type = req.body.vehicle_type;
                    if(req.file){
                        await functions.deleteImage(VehicleTypes.image);
                        VehicleTypes.image = req.file.filename;
                    }
                    await VehicleTypes.save();
                    res.redirect("/view-vehicle-type");
                    return;
                } else {
                    req.flash('error', 'You have no access to update VehicleType, You are not super admin !! *');
                    return res.redirect('back');
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// Active status
module.exports.activeStatus = async(req,res) => {
    try {
        let loginData = await Admin.find({});
        for (let i in loginData) {
            if (String(loginData[i]._id) === req.session.user_id) {
                if (loginData[i].is_admin == 1) {
                    const VehicleTypes = await VehicleType.findById({_id: req.params.id});
                    VehicleTypes.is_active = VehicleTypes.is_active == 1 ? 0 : 1;
                    await VehicleTypes.save();
                    res.redirect("/view-VehicleType");
                } else {
                    req.flash('error', 'You have no access to change status of VehicleType, You are not super admin !! *');
                    return res.redirect('back');
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// Delete VehicleType
module.exports.deleteVehicleType = async(req,res) => {
    try {
        const VehicleTypes = await VehicleType.findById(req.query.id);
        if (VehicleTypes) {
            await functions.deleteImage(VehicleTypes.image);
        }
        const deleteVehicleType = await VehicleType.deleteOne({_id: req.query.id});
        res.redirect("/view-vehicle-type");
    } catch (error) {
        console.error(error);
    }
}