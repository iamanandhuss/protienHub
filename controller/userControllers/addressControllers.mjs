import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs'
import { countries } from "countries-list";

//get the address page

export const addresspage=async(req,res)=>{
    try {
        const user = await User.findOne({_id:req.session._id});
        const address = await User.findOne({_id:req.session._id},{ address: 1});

        res.render('user/userAddress.ejs',{user,address})
    } catch (error) {
        console.log(error);
    }
}

//add address
export const addAddressPage=async(req,res)=>{
    try {
        const user = await User.findOne({_id:req.session._id});
        res.render('user/addAddress.ejs',{user,countries})
    } catch (error) {
        console.log(error);
    }
}
//post add address
export const insertAddress = async (req, res) => {
    try { 
      // Get the user by their session ID (assuming you're using session for user identification)
      const user = await User.findOne({ _id: req.session._id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }     
    const{contactName,building,city,district,state,country,pincode,phonenumber,landmark}=req.body;

    const newAddress={
        contactName,building,city,district,state,country,pincode,phonenumber,landmark
    }
    user.address.push(newAddress)
    await user.save()
    res.status(200).json({ message: 'New address added successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while adding the address' });
    }
  };

export const editAddress=async(req,res)=>{
    try {
        const user = await User.findOne({ "address._id": req.params.addressId });
        const address = await User.findOne(
            { _id: req.session._id, 'address._id': req.params.addressId },
            { 'address.$': 1 }
          );

          res.render('user/editAddress.ejs',{user,address,countries})
    } catch (error) {
        
    }
} 

export const insertEdited = async (req, res) => {
    try {
        const { contactName, building, city, district, state, country, pincode, phonenumber, landmark } = req.body;
        
        const { addressId } = req.params;
        const userId = req.session._id; 

        const result = await User.find(
            { "address._id": ObjectId("addressId") }, // Find user and address by IDs
            {
                $set: {
                    "address.$.contactName": contactName,
                    "address.$.building": building, 
                    "address.$.city": city,
                    "address.$.district": district,
                    "address.$.state": state,
                    "address.$.country": country,
                    "address.$.pincode": pincode,
                    "address.$.phonenumber": phonenumber,
                    "address.$.landmark": landmark
                }
            }
        );

        if (result.nModified > 0) {
            res.status(200).json({ message: 'Address updated successfully' });
        } else {
            res.status(404).json({ error: 'Address not found' });
        }
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: 'An error occurred while updating the address' });
    }
}; 

//delete address
export const deleteAddress = async(req, res) => {
    const {addressId } = req.params;
    const userId=req.session._id 
  
    try {
      // Find the user and remove the address from the address array
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { address: { _id: addressId } }
        },
        { new: true } // Return the updated document
      );    
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Address deleted successfully', user });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
