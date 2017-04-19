
const express = require('express');
const fedexRoutes = express.Router();
const winston = require('winston');
const util = require('util');

module.exports = (fedex) => {

  fedexRoutes.get('/', (req, res, next) => {

    /**
   * Ship
   */
  var date = new Date();
  fedex.ship({
    RequestedShipment: {
      ShipTimestamp: new Date(date.getTime() + (24*60*60*1000)).toISOString(),
      DropoffType: 'REGULAR_PICKUP',
      ServiceType: 'FEDEX_GROUND',
      PackagingType: 'YOUR_PACKAGING',
      Shipper: {
        Contact: {
          PersonName: 'Sender Name',
          CompanyName: 'Company Name',
          PhoneNumber: '5555555555'
        },
        Address: {
          StreetLines: [
            'Address Line 1'
          ],
          City: 'Collierville',
          StateOrProvinceCode: 'TN',
          PostalCode: '38017',
          CountryCode: 'US'
        }
      },
      Recipient: {
        Contact: {
          PersonName: 'Recipient Name',
          CompanyName: 'Company Receipt Name',
          PhoneNumber: '5555555555'
        },
        Address: {
          StreetLines: [
            'Address Line 1'
          ],
          City: 'Charlotte',
          StateOrProvinceCode: 'NC',
          PostalCode: '28202',
          CountryCode: 'US',
          Residential: false
        }
      },
      ShippingChargesPayment: {
        PaymentType: 'SENDER',
        Payor: {
          ResponsibleParty: {
            AccountNumber: fedex.options.account_number
          }
        }
      },
      LabelSpecification: {
        LabelFormatType: 'COMMON2D',
        ImageType: 'PDF',
        LabelStockType: 'PAPER_4X6'
      },
      PackageCount: '1',
      RequestedPackageLineItems: [{
        SequenceNumber: 1,
        GroupPackageCount: 1,
        Weight: {
          Units: 'LB',
          Value: '50.0'
        },
        Dimensions: {
          Length: 108,
          Width: 5,
          Height: 5,
          Units: 'IN'
        }
      }]
    }
  }, function(err, result) {
    if(err) {
      return console.log(util.inspect(err, {depth: null}));
    }

    console.log(util.inspect(result, {depth: null}));
    return res.send(result);
  });


  });
  return fedexRoutes;

}